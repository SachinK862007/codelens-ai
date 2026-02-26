# backend/utils/response_formatter.py
"""
API response formatting utilities
Standardizes API responses across the application
"""

from typing import Dict, Any, Optional, List
from datetime import datetime
import json

class ResponseFormatter:
    """API response formatting utilities"""
    
    @staticmethod
    def success(data: Any = None, message: str = "Success", 
                metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Format successful response"""
        response = {
            "success": True,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        
        if data is not None:
            response["data"] = data
        
        if metadata:
            response["metadata"] = metadata
        
        return response
    
    @staticmethod
    def error(message: str, error_code: str = "GENERAL_ERROR", 
              details: Any = None, status_code: int = 400) -> Dict[str, Any]:
        """Format error response"""
        response = {
            "success": False,
            "error": {
                "code": error_code,
                "message": message,
                "status_code": status_code,
                "timestamp": datetime.now().isoformat()
            }
        }
        
        if details:
            response["error"]["details"] = details
        
        return response
    
    @staticmethod
    def paginated(data: List[Any], page: int, per_page: int, 
                  total: int, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Format paginated response"""
        response = {
            "success": True,
            "data": data,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "pages": (total + per_page - 1) // per_page,
                "has_next": page * per_page < total,
                "has_prev": page > 1
            },
            "timestamp": datetime.now().isoformat()
        }
        
        if metadata:
            response["metadata"] = metadata
        
        return response
    
    @staticmethod
    def with_validation_errors(errors: List[str], 
                             message: str = "Validation failed") -> Dict[str, Any]:
        """Format response with validation errors"""
        return ResponseFormatter.error(
            message=message,
            error_code="VALIDATION_ERROR",
            details={"validation_errors": errors}
        )
    
    @staticmethod
    def with_warnings(data: Any, warnings: List[str], 
                     message: str = "Success with warnings") -> Dict[str, Any]:
        """Format response with warnings"""
        response = ResponseFormatter.success(data, message)
        response["warnings"] = warnings
        return response
    
    @staticmethod
    def json_serializable(obj: Any) -> Any:
        """Make object JSON serializable"""
        if isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, dict):
            return {key: ResponseFormatter.json_serializable(value) for key, value in obj.items()}
        elif isinstance(obj, (list, tuple)):
            return [ResponseFormatter.json_serializable(item) for item in obj]
        elif hasattr(obj, '__dict__'):
            return ResponseFormatter.json_serializable(obj.__dict__)
        else:
            return obj
    
    @staticmethod
    def format_exception(exception: Exception) -> Dict[str, Any]:
        """Format exception for response"""
        return ResponseFormatter.error(
            message=str(exception),
            error_code="INTERNAL_ERROR",
            details={
                "exception_type": type(exception).__name__,
                "exception_args": exception.args
            }
        )

# Global instance
response_formatter = ResponseFormatter()
