# backend/utils/security_utils.py
"""
Security helper functions
Provides security-related utility functions
"""

import hashlib
import secrets
import re
from typing import Dict, Any, List, Optional
import bcrypt

class SecurityHelper:
    """Security-related utility functions"""
    
    @staticmethod
    def generate_password_hash(password: str) -> str:
        """Generate bcrypt hash for password.

        bcrypt only considers the first 72 bytes of the input; we truncate here
        to avoid unexpected errors later on.
        """
        pw_bytes = password.encode('utf-8')
        if len(pw_bytes) > 72:
            pw_bytes = pw_bytes[:72]
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(pw_bytes, salt).decode('utf-8')
    
    @staticmethod
    def verify_password_hash(password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    @staticmethod
    def generate_secure_token(length: int = 32) -> str:
        """Generate cryptographically secure random token"""
        return secrets.token_urlsafe(length)
    
    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """Hash API key for secure storage"""
        return hashlib.sha256(api_key.encode()).hexdigest()
    
    @staticmethod
    def validate_password_strength(password: str) -> Dict[str, Any]:
        """Validate password strength"""
        errors = []
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one digit")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("Password must contain at least one special character")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors
        }
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename to prevent directory traversal"""
        # Remove path separators
        filename = re.sub(r'[\\/]', '', filename)
        # Remove control characters
        filename = re.sub(r'[\x00-\x1f\x7f]', '', filename)
        return filename
    
    @staticmethod
    def is_safe_redirect_url(url: str, allowed_domains: List[str]) -> bool:
        """Check if redirect URL is safe"""
        from urllib.parse import urlparse
        try:
            parsed = urlparse(url)
            if not parsed.netloc:
                return True  # Relative URL is safe
            return any(domain in parsed.netloc for domain in allowed_domains)
        except:
            return False
    
    @staticmethod
    def generate_csrf_token() -> str:
        """Generate CSRF protection token"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def rate_limit_key(identifier: str, action: str) -> str:
        """Generate rate limit key"""
        return f"rate_limit:{action}:{identifier}"
    
    @staticmethod
    def obfuscate_email(email: str) -> str:
        """Obfuscate email for display"""
        if '@' not in email:
            return email
        username, domain = email.split('@')
        if len(username) <= 2:
            obfuscated_username = '*' * len(username)
        else:
            obfuscated_username = username[0] + '*' * (len(username) - 2) + username[-1]
        return f"{obfuscated_username}@{domain}"

# Global instance
security_helper = SecurityHelper()
