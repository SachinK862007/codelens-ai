# backend/config/security.py
"""
Security utilities and middleware for CodeLens AI
Handles authentication, authorization, and security measures
"""

import hashlib
import secrets
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import bcrypt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import redis
import os

from backend.config.settings import settings

# bcrypt has a hard limit of 72 bytes per password; we'll truncate automatically
_BCRYPT_MAX_BYTES = 72

# JWT bearer security
security = HTTPBearer()

class SecurityManager:
    """Security manager for authentication and authorization"""
    
    def __init__(self):
        self.secret_key = settings.secret_key
        self.algorithm = settings.algorithm
        self.access_token_expire_minutes = settings.access_token_expire_minutes
        try:
            self.redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True) if settings.redis_url else None
        except Exception:
            self.redis_client = None
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash using bcrypt directly.

        The input is truncated to 72 bytes to match the behaviour of
        ``get_password_hash`` (which already truncates before hashing).
        """
        if isinstance(plain_password, str):
            plain_password = plain_password.encode("utf-8")
        if isinstance(hashed_password, str):
            hashed_password = hashed_password.encode("utf-8")

        if len(plain_password) > _BCRYPT_MAX_BYTES:
            plain_password = plain_password[:_BCRYPT_MAX_BYTES]

        # bcrypt.checkpw will return False on invalid inputs rather than raising
        return bcrypt.checkpw(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """Generate a bcrypt hash for a password.

        bcrypt can only process the first 72 bytes of a password.  If the caller
        passes a longer string we truncate it silently (as recommended by the
        underlying C library) rather than letting the bcrypt module raise a
        confusing exception during application startup.
        """
        if isinstance(password, str):
            pw_bytes = password.encode("utf-8")
        else:
            pw_bytes = password

        if len(pw_bytes) > _BCRYPT_MAX_BYTES:
            # truncate in the same way the C library would; we could also raise
            # an error if that behaviour is not desired.
            pw_bytes = pw_bytes[:_BCRYPT_MAX_BYTES]

        hashed = bcrypt.hashpw(pw_bytes, bcrypt.gensalt())
        # return string representation for storage
        return hashed.decode("utf-8")
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=self.access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    async def get_current_user(self, credentials: HTTPAuthorizationCredentials = Depends(security)):
        """Get current user from token"""
        token = credentials.credentials
        payload = self.verify_token(token)
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {"username": username, "user_id": payload.get("user_id")}
    
    def rate_limit_check(self, identifier: str, limit: int = 10, window: int = 60) -> bool:
        """Check if request is within rate limits"""
        if not self.redis_client:
            return True  # No rate limiting if Redis not configured
        
        try:
            key = f"rate_limit:{identifier}"
            current = self.redis_client.get(key)
            
            if current is None:
                self.redis_client.setex(key, window, 1)
                return True
            
            if int(current) >= limit:
                return False
            
            self.redis_client.incr(key)
            return True
        except Exception:
            # Fail open - don't block requests if Redis fails
            return True
    
    def generate_secure_token(self, length: int = 32) -> str:
        """Generate a cryptographically secure random token"""
        return secrets.token_urlsafe(length)
    
    def hash_api_key(self, api_key: str) -> str:
        """Hash an API key for secure storage"""
        return hashlib.sha256(api_key.encode()).hexdigest()

# Global security manager instance
security_manager = SecurityManager()

# Dependency for protected routes
get_current_user = security_manager.get_current_user
