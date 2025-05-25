import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderTracking = ({ orderId, onUpdate }) => {
  const [trackingInfo, setTrackingInfo] = useState({
    courierName: '',
    trackingNumber: '',
    estimatedDelivery: '',
    status: 'in_transit', // in_transit, delivered, out_for_delivery, etc.
    notes: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await axios.put(`/api/orders/${orderId}/tracking`, trackingInfo);
      toast.success('Tracking information updated successfully');
      if (onUpdate) {
        onUpdate(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update tracking information');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">Update Tracking Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Courier Name
          </label>
          <input
            type="text"
            value={trackingInfo.courierName}
            onChange={(e) => setTrackingInfo({ ...trackingInfo, courierName: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tracking Number
          </label>
          <input
            type="text"
            value={trackingInfo.trackingNumber}
            onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingNumber: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Delivery Date
          </label>
          <input
            type="date"
            value={trackingInfo.estimatedDelivery}
            onChange={(e) => setTrackingInfo({ ...trackingInfo, estimatedDelivery: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={trackingInfo.status}
            onChange={(e) => setTrackingInfo({ ...trackingInfo, status: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
            required
          >
            <option value="processing">Processing</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Delivery Failed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={trackingInfo.notes}
            onChange={(e) => setTrackingInfo({ ...trackingInfo, notes: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className={`w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors ${
            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUpdating ? 'Updating...' : 'Update Tracking Information'}
        </button>
      </form>
    </div>
  );
};

export default OrderTracking; 