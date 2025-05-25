import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/users');
      const customersData = Array.isArray(response.data) ? response.data : [];
      
      // Add default values for missing properties
      const processedCustomers = customersData.map(customer => ({
        ...customer,
        orderCount: customer.orderCount || 0,
        totalSpent: customer.totalSpent || 0,
        lastOrder: customer.lastOrder || new Date().toISOString(),
        name: customer.name || 'N/A',
        email: customer.email || 'N/A'
      }));
      
      setCustomers(processedCustomers);
      setFilteredCustomers(processedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!Array.isArray(customers)) {
      setFilteredCustomers([]);
      return;
    }

    let result = [...customers];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(customer =>
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc'
          ? (a.name || '').localeCompare(b.name || '')
          : (b.name || '').localeCompare(a.name || '');
      }
      if (sortConfig.key === 'orderCount') {
        return sortConfig.direction === 'asc'
          ? (a.orderCount || 0) - (b.orderCount || 0)
          : (b.orderCount || 0) - (a.orderCount || 0);
      }
      if (sortConfig.key === 'totalSpent') {
        return sortConfig.direction === 'asc'
          ? (a.totalSpent || 0) - (b.totalSpent || 0)
          : (b.totalSpent || 0) - (a.totalSpent || 0);
      }
      return 0;
    });

    setFilteredCustomers(result);
  }, [customers, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/api/users/${customerId}`);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error(error.response?.data?.message || 'Failed to delete customer');
      }
    }
  };

  const CustomerDetails = ({ customer }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Customer Details</h2>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Customer Information</h3>
              <p className="text-sm text-gray-600">Name: {customer.name}</p>
              <p className="text-sm text-gray-600">Email: {customer.email}</p>
              <p className="text-sm text-gray-600">Phone: {customer.phone || 'N/A'}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">Address</h3>
              {customer.address ? (
                <>
                  <p className="text-sm text-gray-600">
                    {typeof customer.address === 'object' 
                      ? `${customer.address.street || ''}, ${customer.address.city || ''}, ${customer.address.state || ''} ${customer.address.postalCode || ''}`
                      : customer.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    {typeof customer.address === 'object' 
                      ? customer.address.country || ''
                      : ''}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-600">No address provided</p>
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-900">Order Summary</h3>
              <p className="text-sm text-gray-600">Total Orders: {customer.orderCount || 0}</p>
              <p className="text-sm text-gray-600">Total Spent: ${(customer.totalSpent || 0).toFixed(2)}</p>
              <p className="text-sm text-gray-600">Last Order: {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  CustomerDetails.propTypes = {
    customer: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      orderCount: PropTypes.number.isRequired,
      totalSpent: PropTypes.number.isRequired,
      lastOrder: PropTypes.string.isRequired,
    }).isRequired,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700">Search Customers</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('orderCount')}
                >
                  Orders {sortConfig.key === 'orderCount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalSpent')}
                >
                  Total Spent {sortConfig.key === 'totalSpent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.orderCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${(customer.totalSpent || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(customer._id)}
                      className="text-red-600 hover:text-red-900 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && <CustomerDetails customer={selectedCustomer} />}
    </div>
  );
};

export default AdminCustomers; 