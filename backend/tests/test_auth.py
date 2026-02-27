# backend/tests/test_auth.py
"""
Tests for authentication endpoints
"""

import pytest
from fastapi import status


class TestAuthFeature:
    """Test authentication functionality"""
    
    def test_register_new_user(self, client):
        """Test user registration with valid data"""
        response = client.post(
            "/auth/register",
            json={
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "securepass123",
                "full_name": "New User"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["message"] == "User registered successfully"
        assert data["user"]["username"] == "newuser"
        assert data["user"]["email"] == "newuser@example.com"
    
    def test_register_duplicate_username(self, client):
        """Test registration with existing username"""
        # Register first user
        client.post(
            "/auth/register",
            json={
                "username": "testuser",
                "email": "test1@example.com",
                "password": "pass123",
                "full_name": "Test User"
            }
        )
        
        # Try to register with same username
        response = client.post(
            "/auth/register",
            json={
                "username": "testuser",
                "email": "test2@example.com",
                "password": "pass456",
                "full_name": "Test User 2"
            }
        )
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    def test_login_valid_credentials(self, client):
        """Test login with valid credentials"""
        # Register user first
        client.post(
            "/auth/register",
            json={
                "username": "logintest",
                "email": "login@example.com",
                "password": "testpass123",
                "full_name": "Login Test"
            }
        )
        
        # Login
        response = client.post(
            "/auth/login",
            json={
                "username": "logintest",
                "password": "testpass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_invalid_username(self, client):
        """Test login with non-existent username"""
        response = client.post(
            "/auth/login",
            json={
                "username": "nonexistent",
                "password": "anypassword"
            }
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "incorrect" in response.json()["detail"].lower()
    
    def test_login_invalid_password(self, client):
        """Test login with wrong password"""
        # Register user
        client.post(
            "/auth/register",
            json={
                "username": "passtest",
                "email": "passtest@example.com",
                "password": "correctpass",
                "full_name": "Pass Test"
            }
        )
        
        # Try wrong password
        response = client.post(
            "/auth/login",
            json={
                "username": "passtest",
                "password": "wrongpass"
            }
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_logout(self, client):
        """Test logout endpoint"""
        response = client.post("/auth/logout")
        assert response.status_code == 200
        assert "message" in response.json()
    
    def test_forgot_password(self, client):
        """Test forgot password endpoint"""
        response = client.post(
            "/auth/forgot-password",
            json={"email": "test@example.com"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "reset_token" in data
    
    def test_reset_password(self, client):
        """Test password reset endpoint"""
        response = client.post(
            "/auth/reset-password",
            json={
                "token": "sometoken",
                "new_password": "newpass123"
            }
        )
        assert response.status_code == 200
        assert "message" in response.json()
