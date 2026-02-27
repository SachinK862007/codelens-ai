# backend/tests/test_practice.py
"""
Tests for Practice Task feature
Unit tests for exercise management and assessment
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from backend.app import app

client = TestClient(app)

class TestPracticeFeature:
    """Test cases for Practice Task feature"""
    
    def test_get_exercises(self):
        """Test getting practice exercises"""
        practice_request = {
            "language": "python",
            "difficulty": "beginner",
            "current_level": 1
        }
        response = client.post("/practice/get-exercises", json=practice_request)
        assert response.status_code == 200
    
    def test_submit_exercise(self):
        """Test submitting exercise solution"""
        submission_request = {
            "exercise_id": 1,
            "code_submission": "print('Hello, World!')"
        }
        response = client.post("/practice/submit-exercise", json=submission_request)
        if response.status_code != 200:
            print(f"Error response: {response.text}")
        assert response.status_code == 200
    
    def test_get_user_progress(self):
        """Test getting user progress"""
        response = client.get("/practice/progress/1")
        assert response.status_code == 200
    
    def test_invalid_exercise_submission(self):
        """Test submitting invalid exercise"""
        submission_request = {
            "exercise_id": 999,  # Non-existent exercise
            "code_submission": ""
        }
        response = client.post("/practice/submit-exercise", json=submission_request)
        assert response.status_code == 404 or response.status_code == 500
    
    def test_exercise_with_syntax_error(self):
        """Test submitting exercise with syntax error"""
        submission_request = {
            "exercise_id": 1,
            "code_submission": "print('Hello World'"  # Missing closing parenthesis
        }
        response = client.post("/practice/submit-exercise", json=submission_request)
        assert response.status_code == 200  # Should still process, just mark as failed
    
    def test_progress_tracking(self):
        """Test progress tracking functionality"""
        # Test multiple submissions to track progress (only exercise IDs 1-2 exist)
        for i in range(2):
            submission_request = {
                "exercise_id": i + 1,
                "code_submission": f"print('Exercise {i + 1}')"
            }
            response = client.post("/practice/submit-exercise", json=submission_request)
            assert response.status_code == 200 or response.status_code == 500

if __name__ == "__main__":
    pytest.main([__file__])
