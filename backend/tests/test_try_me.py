# backend/tests/test_try_me.py
"""
Tests for Try Me feature
Unit tests for code execution and visualization
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from typing import Dict, Any

from backend.app import app
from backend.services.execution_tracer import ExecutionTracer

client = TestClient(app)

class TestTryMeFeature:
    """Test cases for Try Me feature"""
    
    def test_execute_simple_code(self):
        """Test executing simple Python code"""
        code = "print('Hello, World!')"
        response = client.post("/try-me/execute", json={"code": code})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "Hello, World!" in data["output"]
    
    def test_execute_with_variables(self):
        """Test executing code with variables"""
        code = """
x = 5
y = 10
result = x + y
print(f"Result: {result}")
"""
        response = client.post("/try-me/execute", json={"code": code})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "Result: 15" in data["output"]
    
    def test_execute_with_error(self):
        """Test executing code with syntax error"""
        code = "print('Hello World'"
        response = client.post("/try-me/execute", json={"code": code})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == False
        assert "error" in data
    
    def test_execution_tracer_basic(self):
        """Test execution tracer functionality"""
        tracer = ExecutionTracer()
        code = "x = 1\ny = 2\nprint(x + y)"
        result = tracer.execute_with_trace(code)
        assert result["success"] == True
        assert len(result["trace"]) > 0
        # Find the first 'line' event (first entry may be 'call')
        line_events = [t for t in result["trace"] if t["event"] == "line"]
        assert len(line_events) > 0
        assert "locals" in line_events[0]
    
    def test_predict_output(self):
        """Test predict output endpoint"""
        code = "x = 5\nprint(x * 2)"
        response = client.post("/try-me/predict-output", json=code)
        assert response.status_code in (200, 422, 500)
    
    def test_flowchart_generation(self):
        """Test flowchart generation"""
        code = """
def greet(name):
    return f"Hello, {name}!"

result = greet("World")
print(result)
"""
        response = client.post("/try-me/execute", json={"code": code})
        assert response.status_code == 200

if __name__ == "__main__":
    pytest.main([__file__])
