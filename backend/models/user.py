# backend/models/user.py
"""
User data models and authentication schemas
Handles user registration, login, and profile management
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserProfile(BaseModel):
    user_id: int
    current_level: int = 1
    completed_exercises: int = 0
    total_points: int = 0
    streak_days: int = 0
    last_activity: datetime
