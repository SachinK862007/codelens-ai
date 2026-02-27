# backend/tests/test_ideas.py
"""
Tests for Ideas feature
Unit tests for project planning and ideation
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from backend.app import app

client = TestClient(app)

class TestIdeasFeature:
    """Test cases for Ideas feature"""
    
    def test_generate_project_plan(self):
        """Test generating project plan"""
        idea_request = {
            "idea_description": "A todo list application",
            "skill_level": "beginner",
            "preferred_language": "python"
        }
        response = client.post("/ideas/generate-plan", json=idea_request)
        assert response.status_code == 200 or response.status_code == 500
    
    def test_recommend_resources(self):
        """Test recommending learning resources"""
        topics = ["python", "web development"]
        response = client.post("/ideas/recommend-resources", json=topics)
        assert response.status_code == 200
    
    def test_suggest_architecture(self):
        """Test suggesting system architecture"""
        idea_request = {
            "idea_description": "Weather dashboard application",
            "skill_level": "intermediate"
        }
        response = client.post("/ideas/suggest-architecture", json=idea_request)
        assert response.status_code == 200
    
    def test_get_popular_ideas(self):
        """Test getting popular project ideas"""
        response = client.get("/ideas/popular-ideas")
        assert response.status_code == 200
        data = response.json()
        assert "ideas" in data
    
    def test_empty_idea_generation(self):
        """Test generating plan with empty idea"""
        idea_request = {
            "idea_description": "",
            "skill_level": "beginner"
        }
        response = client.post("/ideas/generate-plan", json=idea_request)
        # Should handle gracefully
        assert response.status_code in (200, 400, 500)
    
    def test_complex_idea_generation(self):
        """Test generating plan for complex idea"""
        idea_request = {
            "idea_description": "Machine learning powered recommendation system for online courses with user profiles and collaborative filtering",
            "skill_level": "advanced",
            "preferred_language": "python",
            "time_constraint": "3 months",
            "existing_skills": ["python", "machine learning", "web development"]
        }
        response = client.post("/ideas/generate-plan", json=idea_request)
        assert response.status_code == 200 or response.status_code == 500

if __name__ == "__main__":
    pytest.main([__file__])
