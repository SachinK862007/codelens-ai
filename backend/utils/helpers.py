# backend/utils/helpers.py
"""
General utility functions for CodeLens AI
Provides helper functions for common operations
"""

import hashlib
import secrets
import json
import time
from typing import Dict, Any, List
from datetime import datetime
import re

class Helper:
    """General utility functions"""
    
    @staticmethod
    def generate_id() -> str:
        """Generate a unique ID"""
        return secrets.token_urlsafe(16)
    
    @staticmethod
    def hash_string(text: str) -> str:
        """Generate SHA-256 hash of string"""
        return hashlib.sha256(text.encode()).hexdigest()
    
    @staticmethod
    def format_time(seconds: float) -> str:
        """Format time in human-readable format"""
        if seconds < 1:
            return f"{seconds*1000:.1f}ms"
        elif seconds < 60:
            return f"{seconds:.1f}s"
        else:
            minutes = int(seconds // 60)
            secs = seconds % 60
            return f"{minutes}m {secs:.1f}s"
    
    @staticmethod
    def truncate_text(text: str, max_length: int = 100) -> str:
        """Truncate text to maximum length"""
        if len(text) <= max_length:
            return text
        return text[:max_length-3] + "..."
    
    @staticmethod
    def calculate_percentage(part: float, whole: float) -> float:
        """Calculate percentage"""
        if whole == 0:
            return 0
        return round((part / whole) * 100, 2)
    
    @staticmethod
    def safe_json_parse(json_str: str) -> Dict[str, Any]:
        """Safely parse JSON string"""
        try:
            return json.loads(json_str)
        except (json.JSONDecodeError, TypeError):
            return {}
    
    @staticmethod
    def get_file_extension(filename: str) -> str:
        """Get file extension from filename"""
        if '.' in filename:
            return filename.split('.')[-1].lower()
        return ''
    
    @staticmethod
    def generate_timestamp() -> str:
        """Generate ISO format timestamp"""
        return datetime.now().isoformat()

# Global instance
helper = Helper()
