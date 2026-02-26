# backend/utils/validators.py
"""
Input validation utilities
Provides validation functions for various data types
"""

import re
from typing import Dict, Any, List, Optional
from datetime import datetime

class ValidationError(Exception):
    """Custom validation error"""
    pass

class Validator:
    """Input validation utilities"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_username(username: str) -> bool:
        """Validate username format"""
        if not username:
            return False
        if len(username) < 3 or len(username) > 30:
            return False
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return False
        return True
    
    @staticmethod
    def validate_password(password: str) -> Dict[str, Any]:
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
    def validate_code(code: str, language: str = "python") -> Dict[str, Any]:
        """Validate code content"""
        errors = []
        
        if not code or not code.strip():
            errors.append("Code cannot be empty")
        
        if len(code) > 10000:  # 10KB limit
            errors.append("Code exceeds maximum length of 10KB")
        
        # Language-specific validation
        if language.lower() == "python":
            # Check for basic Python syntax issues
            if code.count('(') != code.count(')'):
                errors.append("Mismatched parentheses")
            if code.count('[') != code.count(']'):
                errors.append("Mismatched brackets")
            if code.count('{') != code.count('}'):
                errors.append("Mismatched braces")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors
        }
    
    @staticmethod
    def validate_json_schema(data: Dict[str, Any], schema: Dict[str, Any]) -> Dict[str, Any]:
        """Validate data against JSON schema"""
        errors = []
        
        for field, field_schema in schema.items():
            required = field_schema.get("required", False)
            field_type = field_schema.get("type")
            value = data.get(field)
            
            # Check required fields
            if required and (field not in data or data[field] is None):
                errors.append(f"Field '{field}' is required")
                continue
            
            # Skip validation for optional missing fields
            if field not in data or data[field] is None:
                continue
            
            # Type validation
            if field_type == "string":
                if not isinstance(value, str):
                    errors.append(f"Field '{field}' must be a string")
                else:
                    min_length = field_schema.get("min_length")
                    max_length = field_schema.get("max_length")
                    if min_length and len(value) < min_length:
                        errors.append(f"Field '{field}' must be at least {min_length} characters")
                    if max_length and len(value) > max_length:
                        errors.append(f"Field '{field}' must be at most {max_length} characters")
            
            elif field_type == "integer":
                if not isinstance(value, int):
                    errors.append(f"Field '{field}' must be an integer")
                else:
                    minimum = field_schema.get("minimum")
                    maximum = field_schema.get("maximum")
                    if minimum is not None and value < minimum:
                        errors.append(f"Field '{field}' must be at least {minimum}")
                    if maximum is not None and value > maximum:
                        errors.append(f"Field '{field}' must be at most {maximum}")
            
            elif field_type == "array":
                if not isinstance(value, list):
                    errors.append(f"Field '{field}' must be an array")
                else:
                    min_items = field_schema.get("min_items")
                    max_items = field_schema.get("max_items")
                    if min_items and len(value) < min_items:
                        errors.append(f"Field '{field}' must have at least {min_items} items")
                    if max_items and len(value) > max_items:
                        errors.append(f"Field '{field}' must have at most {max_items} items")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors
        }
    
    @staticmethod
    def validate_language(language: str) -> bool:
        """Validate programming language"""
        supported_languages = ["python", "c", "cpp", "javascript"]
        return language.lower() in supported_languages
    
    @staticmethod
    def sanitize_input(text: str) -> str:
        """Sanitize input text"""
        if not text:
            return ""
        
        # Remove null bytes
        text = text.replace('\x00', '')
        
        # Limit length
        if len(text) > 10000:
            text = text[:10000]
        
        return text
    
    @staticmethod
    def validate_api_key(api_key: str) -> bool:
        """Validate API key format"""
        if not api_key:
            return False
        # Simple validation - alphanumeric and dashes/underscores only
        return bool(re.match(r'^[a-zA-Z0-9_-]+$', api_key))

# Validation schemas
USER_SCHEMA = {
    "username": {"type": "string", "required": True, "min_length": 3, "max_length": 30},
    "email": {"type": "string", "required": True},
    "password": {"type": "string", "required": True, "min_length": 8}
}

CODE_SUBMISSION_SCHEMA = {
    "code": {"type": "string", "required": True},
    "language": {"type": "string", "required": True},
    "exercise_id": {"type": "integer", "required": True, "minimum": 1}
}

PROJECT_IDEA_SCHEMA = {
    "idea_description": {"type": "string", "required": True, "min_length": 10},
    "skill_level": {"type": "string", "required": False},
    "preferred_language": {"type": "string", "required": False}
}
