import { useState } from 'react';
import { motion } from 'framer-motion';

const OrderHistory = ({ orders }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {orders?.map((order) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Order #{order._id}</h3>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Shipping Address</p>
                  <p className="font-medium">{order.shippingAddress.street}</p>
                  <p className="text-sm text-gray-500">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              {expandedOrder === order._id ? 'Show Less' : 'Show More'}
            </button>

            {expandedOrder === order._id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t"
              >
                <h4 className="font-semibold mb-2">Order Timeline</h4>
                <div className="space-y-2">
                  {order.timeline?.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-gray-400"></div>
                      <div>
                        <p className="text-sm font-medium">{event.status}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OrderHistory; 