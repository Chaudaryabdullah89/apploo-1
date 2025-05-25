import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import { 
  FiShoppingBag, FiDollarSign, FiUsers, FiPackage, 
  FiAlertCircle, FiStar, FiCalendar, FiCreditCard, 
  FiCheckCircle
} from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    monthlyRevenue: [],
    topProducts: [],
    lowStockProducts: [],
    orderStatusCounts: {},
    paymentStats: {
      totalPaid: 0,
      totalUnpaid: 0,
      paymentMethods: {}
    },
    customerStats: {
      newCustomers: 0,
      returningCustomers: 0,
      averageOrderValue: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, productsResponse, customersResponse] = await Promise.all([
        api.get('/api/orders'),
        api.get('/api/products'),
        api.get('/api/users')
      ]).catch(error => {
        console.error('API Error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          endpoint: error.config?.url
        });
        throw error;
      });

      // Validate and ensure we have arrays
      const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];
      const products = Array.isArray(productsResponse.data) ? productsResponse.data : [];
      const customers = Array.isArray(customersResponse.data) ? customersResponse.data : [];

      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const paidOrders = orders.filter(order => order.isPaid);
      const unpaidOrders = orders.filter(order => !order.isPaid);
      const totalPaid = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const totalUnpaid = unpaidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      // Calculate order status counts
      const orderStatusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      // Calculate payment method stats
      const paymentMethods = orders.reduce((acc, order) => {
        if (order.paymentMethod) {
          acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
        }
        return acc;
      }, {});

      // Calculate monthly revenue
      const monthlyRevenue = orders.reduce((acc, order) => {
        const month = new Date(order.createdAt).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + (order.totalAmount || 0);
        return acc;
      }, {});

      // Find low stock products
      const lowStockProducts = products.filter(product => product.stock < 10);

      // Calculate customer stats
      const newCustomers = customers.filter(customer => {
        const customerAge = new Date() - new Date(customer.createdAt);
        return customerAge < 30 * 24 * 60 * 60 * 1000; // Less than 30 days old
      }).length;

      const returningCustomers = customers.filter(customer => {
        const customerOrders = orders.filter(order => order.user === customer._id);
        return customerOrders.length > 1;
      }).length;

      const averageOrderValue = totalRevenue / (orders.length || 1);

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalCustomers: customers.length,
        recentOrders: orders.slice(-5).reverse(),
        monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue })),
        topProducts: products
          .sort((a, b) => (b.sales || 0) - (a.sales || 0))
          .slice(0, 5),
        lowStockProducts,
        orderStatusCounts,
        paymentStats: {
          totalPaid,
          totalUnpaid,
          paymentMethods
        },
        customerStats: {
          newCustomers,
          returningCustomers,
          averageOrderValue
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome to your admin dashboard</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  {stats.orderStatusCounts.pending || 0} pending
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
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.lowStockProducts.length} low stock
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiPackage className="h-6 w-6 text-purple-600" />
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
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.customerStats.newCustomers} new this month
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FiUsers className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders and Low Stock Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        order.isPaid ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {order.isPaid ? (
                          <FiCheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <FiCreditCard className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order._id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.shippingAddress?.fullName || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Low Stock Alert</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.lowStockProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-red-100 rounded-full">
                        <FiAlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          Only {product.stock} left
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Monthly Revenue</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.monthlyRevenue.map(({ month, revenue }, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FiCalendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{month}</p>
                        <p className="text-sm text-gray-500">
                          {stats.orderStatusCounts[month] || 0} orders
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${revenue.toFixed(2)}
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
                        <FiStar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.sales || 0} sales
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(product.price * (product.sales || 0)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 