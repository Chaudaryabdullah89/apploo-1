import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    // Check if the request is for admin routes
    const isAdminRoute = config.url.startsWith('/admin') || 
                        window.location.pathname.startsWith('/admin') ||
                        (config.url.includes('/orders') && window.location.pathname.startsWith('/admin')) ||
                        (config.url.includes('/products') && window.location.pathname.startsWith('/admin')) ||
                        (config.url.includes('/settings') && window.location.pathname.startsWith('/admin'));
    
    if (isAdminRoute && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (!isAdminRoute && token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // If no token is found, remove any existing Authorization header
      delete config.headers.Authorization;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || 'An error occurred';
      const isAdminRoute = error.config.url.startsWith('/admin') || 
                          window.location.pathname.startsWith('/admin') ||
                          (error.config.url.includes('/orders') && window.location.pathname.startsWith('/admin')) ||
                          (error.config.url.includes('/products') && window.location.pathname.startsWith('/admin')) ||
                          (error.config.url.includes('/settings') && window.location.pathname.startsWith('/admin'));
      
      if (error.response.status === 401) {
        // Handle unauthorized access
        if (isAdminRoute) {
          localStorage.removeItem('adminToken');
        } else {
          localStorage.removeItem('token');
        }
        // Don't redirect here, let the component handle it
      }
      
      toast.error(message);
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      toast.error('An error occurred while setting up the request.');
    }
    
    return Promise.reject(error);
  }
);

export default api; 