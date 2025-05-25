import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      const response = await api.get('/api/admin/verify');
      if (response.data && response.data.admin) {
        setAdmin(response.data.admin);
      } else {
        setAdmin(null);
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Admin auth check error:', error);
      setAdmin(null);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting admin login for:', email);
      const response = await api.post('/api/admin/login', { email, password });
      console.log('Admin login response:', response.data);

      if (!response || !response.data) {
        console.error('No response data received');
        throw new Error('No response from server');
      }

      const { token, admin: adminData } = response.data;

      if (!token) {
        console.error('No token in response');
        throw new Error('No authentication token received');
      }

      if (!adminData) {
        console.error('No admin data in response');
        throw new Error('No admin data received');
      }

      // Set token and admin data before navigation
      localStorage.setItem('adminToken', token);
      setAdmin(adminData);
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate after state is updated
      navigate('/admin/dashboard', { replace: true });
      
      return response.data;
    } catch (error) {
      console.error('Admin login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Admin login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    toast.success('Admin logged out successfully');
    navigate('/admin/login');
  };

  const updateProfile = async (adminData) => {
    try {
      const response = await api.put('/api/admin/profile', adminData);
      if (response.data && response.data.admin) {
        setAdmin(response.data.admin);
        toast.success('Admin profile updated successfully');
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Admin profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update admin profile');
      throw error;
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        updateProfile,
        checkAuth
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AdminAuthContext; 