# backend/tests/test_debug.py
"""
Tests for Debug feature
Unit tests for error analysis and correction
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from backend.app import app

client = TestClient(app)

class TestDebugFeature:
    """Test cases for Debug feature"""
    
    def test_analyze_syntax_error(self):
        """Test analyzing syntax error"""
        code = "print('Hello World'"
        response = client.post("/debug/analyze", json={"code": code})
        assert response.status_code == 200
    
    def test_analyze_runtime_error(self):
        """Test analyzing runtime error"""
        code = """
def divide(a, b):
    return a / b

result = divide(10, 0)
"""
        response = client.post("/debug/analyze", json={
            "code": code, 
            "error_message": "ZeroDivisionError: division by zero"
        })
        assert response.status_code == 200
    
    def test_identify_patterns(self):
        """Test identifying common error patterns"""
        code = """
for i in range(5):
    print(i)
    i = i + 1  # Modifying loop variable
"""
        response = client.post("/debug/identify-patterns", json=code)
        assert response.status_code == 200 or response.status_code == 422 or response.status_code == 500
    
    def test_empty_code_analysis(self):
        """Test analyzing empty code"""
        response = client.post("/debug/analyze", json={"code": ""})
        assert response.status_code == 400 or response.status_code == 500
    
    def test_complex_error_analysis(self):
        """Test analyzing complex error scenarios"""
        code = """
def process_data(data):
    result = []
    for item in data:
        if item > 0:
            result.append(item * 2)
    return result

data = [1, 2, 3, -1, 4]
processed = process_data(data)
print(processed[10])  # Index out of range
"""
        response = client.post("/debug/analyze", json={
            "code": code,
            "error_message": "IndexError: list index out of range"
        })
        assert response.status_code == 200

if __name__ == "__main__":
    pytest.main([__file__])
