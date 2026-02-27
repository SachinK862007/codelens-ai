# backend/config/settings.py
"""
Application settings and configuration management
Centralized configuration for CodeLens AI
"""

import os
from typing import List

from pydantic import ConfigDict

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings

class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env")
    
    # Application settings
    app_name: str = "CodeLens AI"
    debug: bool = True
    version: str = "1.0.0"
    
    # Security settings
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here-change-this")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Database settings
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./codelens.db")
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AI settings
    claude_api_key: str = os.getenv("CLAUDE_API_KEY", "")
    ollama_host: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "qwen3-coder:480b-cloud")
    
    # CORS settings
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # Voice settings
    voice_enabled: bool = os.getenv("VOICE_ENABLED", "true").lower() == "true"

settings = Settings()
