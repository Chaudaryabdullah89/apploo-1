import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../Context/AdminAuthContext';
import { toast } from 'react-toastify';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminAuth();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const user = JSON.parse(params.get('user'));

        if (token && user) {
          await login(token, user);
          toast.success('Login successful!');
          navigate('/admin/dashboard');
        } else {
          toast.error('Invalid authentication data');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        toast.error('Authentication failed');
        navigate('/admin/login');
      }
    };

    handleAuthSuccess();
  }, [location, login, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  );
};

export default AuthSuccess; 