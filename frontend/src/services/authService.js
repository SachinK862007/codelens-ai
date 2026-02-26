// frontend/src/services/authService.js
import api from './api';

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
      return { success: true };
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch profile');
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/me', profileData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { token, new_password: newPassword });
      return response.data;
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  }
}

export default new AuthService();
