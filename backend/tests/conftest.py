# backend/tests/conftest.py
"""
Test configuration and fixtures
Pytest configuration and shared test fixtures
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock
import sys
import os

# Add backend to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.app import app

@pytest.fixture(scope="session")
def client():
    """Create test client fixture"""
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture(scope="function")
def mock_db():
    """Mock database fixture"""
    # In a real implementation, this would mock database operations
    class MockDB:
        def __init__(self):
            self.data = {}
        
        def add(self, key, value):
            self.data[key] = value
        
        def get(self, key):
            return self.data.get(key)
        
        def delete(self, key):
            if key in self.data:
                del self.data[key]
    
    return MockDB()

@pytest.fixture(scope="function")
def mock_ai_response():
    """Mock AI response fixture"""
    return {
        "success": True,
        "response": {
            "message": "This is a mock AI response",
            "confidence": 0.95
        }
    }

@pytest.fixture(scope="function")
def sample_code():
    """Sample code fixture for testing"""
    return """
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

result = fibonacci(5)
print(f"Fibonacci of 5 is {result}")
"""

@pytest.fixture(scope="function")
def sample_error_code():
    """Sample code with error for testing"""
    return """
def divide(a, b):
    return a / b

result = divide(10, 0)  # Division by zero error
"""

@pytest.fixture(scope="function")
def mock_user():
    """Mock user fixture"""
    return {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "full_name": "Test User"
    }

@pytest.fixture(autouse=True)
def mock_ai_engine_setup():
    """Setup AI engine mocking for all tests"""
    async def mock_generate_response(system_prompt, user_content, model=None):
        return {
            "success": True,
            "response": {
                "error_explanation": "Mock error explanation",
                "corrected_code": "# Fixed code",
                "mermaid_flowchart": "graph TD\n    A[Start] --> B[End]",
                "changes_explanation": "Mock fix explanation",
                "message": "Mock response",
                "title": "Test Project",
                "steps": ["Step 1", "Step 2"],
                "algorithm": "Mock algorithm",
                "language": "python",
                "resources": []
            },
            "provider": "mock"
        }
    
    with patch('backend.services.ai_engine.AIEngine.generate_response', new_callable=lambda: AsyncMock(side_effect=mock_generate_response)):
        with patch('backend.services.ai_engine.AIEngine._generate_ollama_response', new_callable=lambda: AsyncMock(side_effect=mock_generate_response)):
            with patch('backend.services.ai_engine.AIEngine.get_debug_prompt', return_value="Debug prompt"):
                with patch('backend.services.ai_engine.AIEngine.get_code_explanation_prompt', return_value="Explain prompt"):
                    yield
