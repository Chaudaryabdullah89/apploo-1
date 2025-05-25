import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../Context/shopcontext';
import CartItems from './Cart';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalCartAmount } = useShop();

  const handleBuyNow = () => {
    if (Object.keys(cartItems).length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/place-order');
  };

  const handleCheckout = () => {
    if (Object.keys(cartItems).length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/place-order');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <CartItems />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${getTotalCartAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(getTotalCartAmount() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(getTotalCartAmount() + 10 + getTotalCartAmount() * 0.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-white text-gray-900 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 