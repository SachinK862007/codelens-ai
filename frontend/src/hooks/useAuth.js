// frontend/src/hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('codelens-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('codelens-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codelens-user');
  };

  const updateProfile = (profileData) => {
    if (user) {
      const updatedUser = {
        ...user,
        full_name: profileData.fullName,
        email: profileData.email,
        username: profileData.username
      };
      setUser(updatedUser);
      localStorage.setItem('codelens-user', JSON.stringify(updatedUser));
    }
  };

  return { user, loading, login, logout, updateProfile };
};
