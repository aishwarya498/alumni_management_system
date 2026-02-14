import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Verify token on mount
  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.data);
        setError('');
      }
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}/auth/register`, formData);

      if (response.data.success) {
        return { success: true, message: 'Registration successful. Please login.' };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  const login = async (username, password) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        return { success: true, message: 'Login successful' };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError('');
  };

  const updateProfile = async (formData) => {
    try {
      setError('');
      const response = await axios.put(`${API_URL}/auth/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.data);
        return { success: true, message: 'Profile updated successfully' };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      setError(message);
      return { success: false, message };
    }
  };

  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}/auth/change-password`, {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        return { success: true, message: 'Password changed successfully' };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Password change failed';
      setError(message);
      return { success: false, message };
    }
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;
    if (typeof requiredRoles === 'string') {
      return user.roles?.includes(requiredRoles);
    }
    return user.roles?.some(role => requiredRoles.includes(role));
  };

  const hasPermission = (requiredPermission) => {
    if (!user) return false;
    return user.permissions?.includes(requiredPermission);
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    hasPermission,
    isAuthenticated: !!user && !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
