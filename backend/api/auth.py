# backend/api/auth.py
"""
Authentication API endpoints
Handles user registration, login, and session management
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional
import secrets
from datetime import timedelta

from backend.models.user import UserCreate, UserLogin, Token, User
from backend.config.security import security_manager
from backend.config.settings import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserRegistrationResponse(BaseModel):
    success: bool
    message: str
    user: Optional[User] = None

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

# Mock user database (in production, use real database)
MOCK_USERS = {
    "demo": {
        "id": 1,
        "email": "demo@example.com",
        "username": "demo",
        "full_name": "Demo User",
        "hashed_password": security_manager.get_password_hash("demo123"),
        "is_active": True,
        "created_at": "2024-01-01T00:00:00",
        "last_login": None
    }
}

@router.post("/register", response_model=UserRegistrationResponse)
async def register_user(user: UserCreate):
    """Register a new user"""
    try:
        # Check if user already exists
        if user.username in MOCK_USERS:
            raise HTTPException(
                status_code=400,
                detail="Username already registered"
            )
        
        if user.email in [u["email"] for u in MOCK_USERS.values()]:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = security_manager.get_password_hash(user.password)
        new_user = {
            "id": len(MOCK_USERS) + 1,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "hashed_password": hashed_password,
            "is_active": True,
            "created_at": "2024-01-01T00:00:00",
            "last_login": None
        }
        
        MOCK_USERS[user.username] = new_user
        
        return UserRegistrationResponse(
            success=True,
            message="User registered successfully",
            user=User(
                id=new_user["id"],
                email=new_user["email"],
                username=new_user["username"],
                full_name=new_user["full_name"],
                is_active=new_user["is_active"],
                created_at=new_user["created_at"],
                last_login=new_user["last_login"]
            )
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    """Authenticate user and return access token"""
    try:
        # Find user
        user = MOCK_USERS.get(user_credentials.username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify password
        if not security_manager.verify_password(user_credentials.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = security_manager.create_access_token(
            data={"sub": user["username"], "user_id": user["id"]},
            expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout_user():
    """Logout user (invalidate token)"""
    # In a real implementation, you would add the token to a blacklist
    return {"message": "Logged out successfully"}

@router.post("/refresh-token", response_model=Token)
async def refresh_token(current_user: dict = Depends(security_manager.get_current_user)):
    """Refresh access token"""
    try:
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = security_manager.create_access_token(
            data={"sub": current_user["username"], "user_id": current_user["user_id"]},
            expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    """Initiate password reset process"""
    try:
        # In a real implementation, you would:
        # 1. Verify email exists
        # 2. Generate secure reset token
        # 3. Send email with reset link
        # 4. Store token with expiration
        
        reset_token = security_manager.generate_secure_token(50)
        
        # For demo purposes, we'll just return the token
        return {
            "message": "Password reset email sent",
            "reset_token": reset_token,  # In production, don't return this!
            "expires_in": "1 hour"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reset-password")
async def reset_password(request: PasswordResetConfirm):
    """Reset user password"""
    try:
        # In a real implementation, you would:
        # 1. Verify reset token is valid and not expired
        # 2. Hash new password
        # 3. Update user's password in database
        # 4. Invalidate the reset token
        
        return {"message": "Password reset successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me", response_model=User)
async def read_users_me(current_user: dict = Depends(security_manager.get_current_user)):
    """Get current user information"""
    try:
        user = MOCK_USERS.get(current_user["username"])
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return User(
            id=user["id"],
            email=user["email"],
            username=user["username"],
            full_name=user["full_name"],
            is_active=user["is_active"],
            created_at=user["created_at"],
            last_login=user["last_login"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
