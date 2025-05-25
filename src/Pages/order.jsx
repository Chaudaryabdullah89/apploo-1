import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { useUserAuth } from '../Context/UserAuthContext';

const Order = () => {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      if (!user) {
        toast.error('Please login to view your orders');
        navigate('/login');
        return;
      }

      console.log('Fetching orders for user:', user);
      const response = await api.get('/api/orders/my-orders');
      console.log('Raw API Response:', response);

      if (!response.data) {
        console.error('No data in response');
        toast.error('No orders data received from server');
        setOrders([]);
        return;
      }

      // Handle different response structures
      let ordersData;
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data.orders && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else {
        console.error('Unexpected response structure:', response.data);
        toast.error('Invalid orders data format');
        setOrders([]);
        return;
      }

      console.log('Processed orders data:', ordersData);

      if (ordersData.length === 0) {
        console.log('No orders found in the data');
        setOrders([]);
        return;
      }

      // Log the structure of the first order to debug
      console.log('First order structure:', {
        id: ordersData[0]._id || ordersData[0].id,
        items: ordersData[0].items,
        itemsLength: ordersData[0].items?.length,
        itemsType: typeof ordersData[0].items,
        isArray: Array.isArray(ordersData[0].items),
        fullOrder: ordersData[0]
      });

      // Sort orders by date (newest first)
      const sortedOrders = ordersData.sort((a, b) => 
        new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      );

      console.log('Sorted orders:', sortedOrders);
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 401) {
          toast.error('Please login to view your orders');
          navigate('/login');
        } else {
          toast.error(error.response.data?.message || 'Failed to fetch orders');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', error.message);
        toast.error('Error setting up request: ' + error.message);
      }
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Order History</h2>
              </div>
              <div className="divide-y">
                {orders.length > 0 ? (
                  orders.map((order) => {
                    console.log('Rendering order:', order);
                    return (
                      <motion.div
                        key={order._id || order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedOrder?._id === order._id ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => {
                          console.log('Selected order:', order);
                          setSelectedOrder(order);
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Order #{order._id?.slice(-6) || order.id?.slice(-6)}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt || order.date)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                            {order.status || 'Processing'}
                          </span>
                        </div>
                        <p className="text-gray-600">${(order.totalAmount || order.total || 0).toFixed(2)}</p>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No orders found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-sm"
              >
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">Order #{selectedOrder._id?.slice(-6) || selectedOrder.id?.slice(-6)}</h2>
                      <p className="text-gray-500">Placed on {formatDate(selectedOrder.createdAt || selectedOrder.date)}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status || 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder && console.log('Selected order items:', selectedOrder.items)}
                    {selectedOrder?.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item) => {
                        console.log('Processing item:', item);
                        return (
                          <div key={item._id || item.id} className="flex gap-4">
                            <img
                              src={item.product?.image || item.image}
                              alt={item.product?.name || item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product?.name || item.name}</h4>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              <p className="text-gray-600">${(item.price || 0).toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-500">
                        {selectedOrder ? 'No items found in this order' : 'Select an order to view items'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <p>{selectedOrder.shippingAddress?.fullName || selectedOrder.shippingAddress?.name}</p>
                      <p>{selectedOrder.shippingAddress?.street}</p>
                      <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode || selectedOrder.shippingAddress?.zip}</p>
                      <p>{selectedOrder.shippingAddress?.country}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Payment Information</h4>
                      <p className="text-gray-600">Payment Method: {selectedOrder.paymentMethod || 'Not specified'}</p>
                      <p className="text-gray-600">Payment Status: {selectedOrder.isPaid ? 'Paid' : 'Pending'}</p>
                      {selectedOrder.isPaid && selectedOrder.paidAt && (
                        <p className="text-gray-600">Paid on: {formatDate(selectedOrder.paidAt)}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${(selectedOrder.itemsPrice || selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>${(selectedOrder.shippingPrice || selectedOrder.shipping || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${(selectedOrder.taxPrice || selectedOrder.tax || 0).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${(selectedOrder.totalAmount || selectedOrder.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
