import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useUserAuth } from '../Context/UserAuthContext';
import api from '../utils/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useUserAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !user) {
      toast.error('Please login to view dashboard');
      navigate('/login', { replace: true });
      return;
    }

    // Fetch user data if authenticated
    if (user) {
      fetchUserData();
    }
  }, [user, authLoading, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/users/profile');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to view dashboard');
        navigate('/login', { replace: true });
      } else {
        toast.error('Failed to fetch user data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout properly');
      navigate('/login', { replace: true });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-8">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                <FiUser className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-white">{userData?.name || user?.name}</h2>
                <p className="text-indigo-100">{userData?.email || user?.email}</p>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Orders Card */}
              <div 
                className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/orders')}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <FiShoppingBag className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
                    <p className="text-gray-500">View your order history</p>
                  </div>
                </div>
              </div>

              {/* Wishlist Card */}
              <div 
                className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/wishlist')}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-pink-100 text-pink-600">
                    <FiHeart className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
                    <p className="text-gray-500">View your saved items</p>
                  </div>
                </div>
              </div>

              {/* Settings Card */}
              <div 
                className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FiSettings className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                    <p className="text-gray-500">Manage your account</p>
                  </div>
                </div>
              </div>

              {/* Logout Card */}
              <div 
                className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-600">
                    <FiLogOut className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Logout</h3>
                    <p className="text-gray-500">Sign out of your account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <p className="text-gray-500 text-center">No recent activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 