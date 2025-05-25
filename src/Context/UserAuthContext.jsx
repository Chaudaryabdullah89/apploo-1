import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await api.get('/api/auth/verify');
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);

      if (!response || !response.data) {
        console.error('No response data received');
        throw new Error('No response from server');
      }

      const { token, data } = response.data;

      if (!token) {
        console.error('No token in response');
        throw new Error('No authentication token received');
      }

      if (!data || !data.user) {
        console.error('No user data in response');
        throw new Error('No user data received');
      }

      localStorage.setItem('token', token);
      setUser(data.user);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Starting registration process');
      
      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Please fill in all required fields');
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Please provide a valid email address');
      }

      // Validate password length
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('Making API request to register user');
      const response = await api.post('/api/auth/register', userData);
      console.log('Registration API response:', response.data);

      if (!response || !response.data) {
        throw new Error('No response from server');
      }

      // Check if the response has the expected structure
      if (response.data.status === 'success' && response.data.token && response.data.data?.user) {
        console.log('Registration successful, setting up user session');
        localStorage.setItem('token', response.data.token);
        setUser(response.data.data.user);
        toast.success('Registration successful!');
        return { status: 'success', user: response.data.data.user };
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // If the error has a response with a message, use that
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        // Otherwise use the error message or a default message
        toast.error(error.message || 'Registration failed. Please try again.');
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/api/auth/profile', userData);
      if (response.data && response.data.user) {
        setUser(response.data.user);
        toast.success('Profile updated successfully');
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        checkAuth
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

UserAuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default UserAuthContext; 