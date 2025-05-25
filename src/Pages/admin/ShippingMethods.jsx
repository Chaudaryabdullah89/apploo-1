import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { toast } from 'react-toastify';

const ShippingMethods = () => {
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMethod, setNewMethod] = useState({
    name: '',
    price: '',
    estimatedDays: '',
    description: ''
  });

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      const response = await api.get('/api/admin/shipping-methods');
      setShippingMethods(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch shipping methods');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMethod(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/shipping-methods', newMethod);
      toast.success('Shipping method added successfully');
      setNewMethod({
        name: '',
        price: '',
        estimatedDays: '',
        description: ''
      });
      fetchShippingMethods();
    } catch (error) {
      toast.error('Failed to add shipping method');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/shipping-methods/${id}`);
      toast.success('Shipping method deleted successfully');
      fetchShippingMethods();
    } catch (error) {
      toast.error('Failed to delete shipping method');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shipping Methods Management</h1>
      
      {/* Add New Shipping Method Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Shipping Method</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={newMethod.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={newMethod.price}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Days</label>
            <input
              type="number"
              name="estimatedDays"
              value={newMethod.estimatedDays}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={newMethod.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Shipping Method
          </button>
        </form>
      </div>

      {/* Shipping Methods List */}
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold p-6 border-b">Current Shipping Methods</h2>
        <div className="divide-y">
          {shippingMethods.map((method) => (
            <div key={method._id} className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{method.name}</h3>
                <p className="text-gray-600">${method.price} - {method.estimatedDays} days</p>
                <p className="text-gray-500 mt-1">{method.description}</p>
              </div>
              <button
                onClick={() => handleDelete(method._id)}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingMethods; 