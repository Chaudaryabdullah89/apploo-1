import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import { toast } from 'react-toastify';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error('Please login to view order details');
          navigate('/login');
          return;
        }

        if (!orderId || orderId === 'undefined') {
          setError('Invalid order ID');
          setIsLoading(false);
          return;
        }

        const response = await api.get(`/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setOrder(response.data);
          setError(null);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        if (err.response?.status === 401) {
          toast.error('Please login to view order details');
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError('Order not found');
        } else {
          setError('Failed to fetch order details');
          toast.error('Failed to fetch order details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || "The order you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Return to Home
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-white text-gray-900 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                View All Orders
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">Thank you for your purchase</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                  <p className="text-sm text-gray-600">Order ID: #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Status: {order.status}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                  <p className="text-sm text-gray-600">{order.shippingAddress?.street}</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                    {order.shippingAddress?.postalCode}
                  </p>
                  <p className="text-sm text-gray-600">{order.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(order.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>${(order.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>${(order.taxPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>${(order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => navigate('/orders')}
                className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                View All Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-gray-900 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 