import { useState, useEffect } from 'react';
import ConfirmationModal from '../../Components/ConfirmationModal';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { 
  FiSearch, FiEye, FiTruck, FiCheckCircle, FiXCircle, FiClock, 
  FiDollarSign, FiUser, FiMapPin, FiPackage, FiMessageSquare,
  FiFilter, FiTrendingUp, FiDownload, FiRefreshCw,
  FiShoppingBag, FiCreditCard, FiCalendar
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updateNote, setUpdateNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState('');
  const [showDismissConfirm, setShowDismissConfirm] = useState(false);
  const [orderToDismiss, setOrderToDismiss] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    statusCounts: {},
    recentActivity: [],
    dailyStats: [],
    paymentStats: {
      totalPaid: 0,
      totalUnpaid: 0,
      paymentMethods: {}
    },
    topProducts: []
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/orders');
      setOrders(response.data);
      calculateStats(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to fetch orders');
      setIsLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const statusCounts = {};
    let totalRevenue = 0;
    const recentActivity = [];
    const dailyStats = {};
    const paymentStats = {
      totalPaid: 0,
      totalUnpaid: 0,
      paymentMethods: {}
    };
    const productStats = {};

    ordersData.forEach(order => {
      // Count statuses
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      
      // Calculate revenue
      if (order.isPaid) {
        totalRevenue += order.totalAmount || 0;
        paymentStats.totalPaid += order.totalAmount || 0;
      } else {
        paymentStats.totalUnpaid += order.totalAmount || 0;
      }

      // Track payment methods
      if (order.paymentMethod) {
        paymentStats.paymentMethods[order.paymentMethod] = 
          (paymentStats.paymentMethods[order.paymentMethod] || 0) + 1;
      }

      // Track daily stats
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = {
          orders: 0,
          revenue: 0
        };
      }
      dailyStats[date].orders++;
      dailyStats[date].revenue += order.totalAmount || 0;

      // Track product stats
      order.items?.forEach(item => {
        const productId = item.product?._id || item._id;
        if (!productStats[productId]) {
          productStats[productId] = {
            name: item.product?.name || item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productStats[productId].quantity += item.quantity || 0;
        productStats[productId].revenue += (item.price || 0) * (item.quantity || 0);
      });

      // Track recent activity
      if (order.statusHistory && order.statusHistory.length > 0) {
        const lastUpdate = order.statusHistory[order.statusHistory.length - 1];
        recentActivity.push({
          orderId: order._id,
          status: lastUpdate.status,
          timestamp: lastUpdate.updatedAt,
          customer: order.shippingAddress?.fullName,
          amount: order.totalAmount
        });
      }
    });

    // Convert daily stats to array and sort by date
    const dailyStatsArray = Object.entries(dailyStats)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7); // Last 7 days

    // Get top products
    const topProducts = Object.entries(productStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5 products

    // Sort recent activity by timestamp
    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setStats({
      totalOrders: ordersData.length,
      totalRevenue,
      averageOrderValue: ordersData.length ? totalRevenue / ordersData.length : 0,
      statusCounts,
      recentActivity: recentActivity.slice(0, 5),
      dailyStats: dailyStatsArray,
      paymentStats,
      topProducts
    });
  };

  const handleDismissOrder = async (orderId) => {
    setOrderToDismiss(orderId);
    setShowDismissConfirm(true);
  };

  const confirmDismissOrder = async () => {
    if (!orderToDismiss) return;

    try {
      setIsUpdating(true);
      const response = await api.put(`/api/orders/${orderToDismiss}/dismiss`);
      
      if (response.data) {
        toast.success('Order has been dismissed');
        await fetchOrders();
      } else {
        throw new Error('No response data received');
      }
    } catch (err) {
      console.error('Failed to dismiss order:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to dismiss order';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
      setShowDismissConfirm(false);
      setOrderToDismiss(null);
    }
  };

  const handleStatusChange = async (orderId, newStatus, note = '') => {
    if (!orderId || !newStatus) {
      toast.error('Invalid order or status');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await api.put(`/api/orders/${orderId}/status`, { 
        status: newStatus,
        statusNote: note,
        statusHistory: {
          status: newStatus,
          note: note,
          updatedAt: new Date().toISOString()
        }
      });

      if (response.data) {
        toast.success(`Order status updated to ${newStatus}`);
        await fetchOrders();
        setShowUpdateModal(false);
        setUpdateNote('');
        setSelectedOrderForUpdate(null);
        setSelectedNewStatus('');
      } else {
        throw new Error('No response data received');
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update order status';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FiClock className="h-5 w-5" />;
      case 'processing':
        return <FiPackage className="h-5 w-5" />;
      case 'shipped':
        return <FiTruck className="h-5 w-5" />;
      case 'delivered':
        return <FiCheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <FiXCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || order?.status === selectedStatus;
    
    const matchesDateRange = (!dateRange.start || new Date(order.createdAt) >= new Date(dateRange.start)) &&
                            (!dateRange.end || new Date(order.createdAt) <= new Date(dateRange.end));

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Date', 'Status', 'Total Amount', 'Payment Status'],
      ...filteredOrders.map(order => [
        order._id,
        order.shippingAddress?.fullName || 'N/A',
        new Date(order.createdAt).toLocaleDateString(),
        order.status,
        order.totalAmount,
        order.isPaid ? 'Paid' : 'Unpaid'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const StatusUpdateModal = ({ order, onClose }) => {
    if (!order) return null;

    const handleSubmit = () => {
      if (!selectedNewStatus) {
        toast.error('Please select a new status');
        return;
      }

      if (selectedNewStatus === order.status) {
        toast.error('Please select a different status');
        return;
      }

      handleStatusChange(order._id, selectedNewStatus, updateNote);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Update Order Status</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
                disabled={isUpdating}
              >
                <FiXCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status
              </label>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status || 'Unknown'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={selectedNewStatus}
                onChange={(e) => setSelectedNewStatus(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isUpdating}
              >
                <option value="">Select new status</option>
                {order.status === 'pending' && <option value="processing">Processing</option>}
                {order.status === 'processing' && <option value="shipped">Shipped</option>}
                {order.status === 'shipped' && <option value="delivered">Delivered</option>}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <option value="cancelled">Cancelled</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Note
              </label>
              <textarea
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                placeholder="Add a note about this status update..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                disabled={isUpdating}
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedNewStatus || isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  StatusUpdateModal.propTypes = {
    order: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      statusHistory: PropTypes.arrayOf(
        PropTypes.shape({
          status: PropTypes.string.isRequired,
          updatedAt: PropTypes.string.isRequired,
          note: PropTypes.string
        })
      )
    }).isRequired,
    onClose: PropTypes.func.isRequired
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiXCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status || 'Unknown'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Order ID: {order._id || 'N/A'}
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FiUser className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{order.shippingAddress?.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      {order.shippingAddress?.address || 'N/A'}, {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.postalCode || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Total: ${(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{order.paymentMethod || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  {order.isPaid && order.paidAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Paid At:</span>
                      <span className="font-medium">
                        {new Date(order.paidAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items && order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={item.product?.image || item.image}
                              alt={item.product?.name || item.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.product?.name || item.name || 'Unknown Product'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.product?.brand || item.brand || 'Unknown Brand'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.size || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(item.price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status History */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Status History</h3>
              <div className="space-y-4">
                {/* Initial Order Creation */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiClock className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Payment Status */}
                {order.isPaid && order.paidAt && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FiDollarSign className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment Received</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.paidAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status History Entries */}
                {order.statusHistory && order.statusHistory.length > 0 ? (
                  order.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <FiMessageSquare className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Status changed to {history.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(history.updatedAt).toLocaleString()}
                        </p>
                        {history.note && (
                          <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 italic">No status updates recorded</div>
                )}

                {/* Delivery Status */}
                {order.isDelivered && order.deliveredAt && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FiTruck className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivered</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.deliveredAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {order.status !== 'dismissed' && order.status !== 'cancelled' && (
                <>
                  <button
                    onClick={() => {
                      setSelectedOrderForUpdate(order);
                      setShowUpdateModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => handleDismissOrder(order._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Dismiss Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  OrderDetailsModal.propTypes = {
    order: PropTypes.shape({
      _id: PropTypes.string,
      status: PropTypes.string,
      statusHistory: PropTypes.arrayOf(
        PropTypes.shape({
          status: PropTypes.string.isRequired,
          updatedAt: PropTypes.string.isRequired,
          note: PropTypes.string
        })
      ),
      shippingAddress: PropTypes.shape({
        fullName: PropTypes.string,
        address: PropTypes.string,
        city: PropTypes.string,
        postalCode: PropTypes.string,
      }),
      totalAmount: PropTypes.number,
      paymentMethod: PropTypes.string,
      isPaid: PropTypes.bool,
      paidAt: PropTypes.string,
      isDelivered: PropTypes.bool,
      deliveredAt: PropTypes.string,
      createdAt: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          product: PropTypes.shape({
            name: PropTypes.string,
            brand: PropTypes.string,
            image: PropTypes.string,
          }),
          size: PropTypes.string,
          price: PropTypes.number,
          quantity: PropTypes.number,
        })
      ),
    }),
    onClose: PropTypes.func.isRequired,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all customer orders</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.statusCounts.pending || 0} pending
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  ${stats.paymentStats.totalUnpaid.toFixed(2)} unpaid
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiDollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Order Value</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.averageOrderValue.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.dailyStats[0]?.orders || 0} orders today
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiTrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Status</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Object.keys(stats.paymentStats.paymentMethods).length} methods
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.paymentStats.totalPaid > 0 ? 'Mostly paid' : 'Pending payments'}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FiCreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                        {getStatusIcon(activity.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{activity.orderId.slice(-6)} - {activity.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.customer} • ${activity.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Top Products</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <FiPackage className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.quantity} units sold</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${product.revenue.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Management */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Orders List</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={exportOrders}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 flex items-center space-x-2 transition-colors"
                >
                  <FiDownload className="h-5 w-5" />
                  <span>Export</span>
                </button>
                <button
                  onClick={fetchOrders}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 flex items-center space-x-2 transition-colors"
                >
                  <FiRefreshCw className="h-5 w-5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="dismissed">Dismissed</option>
              </select>

              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                  setDateRange({ start: '', end: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors"
              >
                <FiFilter className="h-5 w-5" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id?.slice(-6) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.shippingAddress?.fullName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status || 'Unknown'}
                        </span>
                        {order.statusHistory?.length > 0 && (
                          <span className="text-gray-500 text-sm">
                            ({order.statusHistory.length} updates)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        {order.status !== 'dismissed' && order.status !== 'cancelled' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedOrderForUpdate(order);
                                setShowUpdateModal(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Update Status"
                            >
                              <FiCheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDismissOrder(order._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Dismiss Order"
                            >
                              <FiXCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {/* Status Update Modal */}
      {showUpdateModal && (
        <StatusUpdateModal
          order={selectedOrderForUpdate}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedOrderForUpdate(null);
            setSelectedNewStatus('');
            setUpdateNote('');
          }}
        />
      )}

      {/* Dismiss Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDismissConfirm}
        onClose={() => {
          setShowDismissConfirm(false);
          setOrderToDismiss(null);
        }}
        onConfirm={confirmDismissOrder}
        title="Dismiss Order"
        message="Are you sure you want to dismiss this order? This action cannot be undone."
        confirmText="Dismiss Order"
        type="danger"
        isLoading={isUpdating}
      />
    </div>
  );
};

export default AdminOrders; 