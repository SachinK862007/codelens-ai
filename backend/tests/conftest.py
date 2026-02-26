# backend/tests/conftest.py
"""
Test configuration and fixtures
Pytest configuration and shared test fixtures
"""

import pytest
from fastapi.testclient import TestClient
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
def setup_test_environment():
    """Setup test environment before each test"""
    # Set test environment variables
    os.environ["TESTING"] = "True"
    os.environ["DATABASE_URL"] = "sqlite:///./test.db"
    
    yield
    
    # Cleanup after test
    if os.path.exists("./test.db"):
        os.remove("./test.db")
    os.environ.pop("TESTING", None)
    os.environ.pop("DATABASE_URL", None)
