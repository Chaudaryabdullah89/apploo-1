import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import assets from '../assets/assets';
import Title from '../Components/Title';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    console.log('Cart component mounted');
    console.log('Initial cart data:', cart);
  }, []);

  useEffect(() => {
    console.log('Cart data changed:', cart);
    if (cart && Array.isArray(cart)) {
      // Transform the cart data to handle nested product structure
      const transformedCart = cart.map(item => ({
        product: item.product._id || item.product,
        quantity: item.quantity,
        price: item.product.price || item.price,
        name: item.product.name || item.name,
        image: item.product.image || item.image,
        size: item.size || 'M',
        _id: item._id
      }));
      console.log('Transformed cart data:', transformedCart);
      setCartData(transformedCart);
    } else {
      console.log('Invalid cart data, setting empty array');
      setCartData([]);
    }
  }, [cart]);

  const handleCheckout = () => {
    if (cartData.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    // Store cart data in localStorage before navigation
    localStorage.setItem('checkoutData', JSON.stringify({
      items: cartData,
      subtotal: getCartTotal(),
      shipping: 10,
      tax: getCartTotal() * 0.1,
      total: getCartTotal() + 10 + getCartTotal() * 0.1
    }));
    navigate('/place-order');
  };

  const handleBuyNow = () => {
    if (cartData.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    // Store cart data in localStorage before navigation
    localStorage.setItem('checkoutData', JSON.stringify({
      items: cartData,
      subtotal: getCartTotal(),
      shipping: 10,
      tax: getCartTotal() * 0.1,
      total: getCartTotal() + 10 + getCartTotal() * 0.1
    }));
    navigate('/place-order');
  };

  console.log('Rendering Cart component with cartData:', cartData);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-3xl mb-8 uppercase">
          <Title text1="Your" text2="Cart" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartData && cartData.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                {cartData.map((item, index) => {
                  console.log('Rendering cart item:', item);
                  return (
                    <div key={item._id || index} className="py-4 border-b last:border-b-0 text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex flex-row gap-6">
                          <img src={item.image} className="w-16 sm:w-20" alt="" />
                          <div className="flex flex-col">
                            <p className="text-sm sm:text-lg font-medium">{item.name}</p>
                            <div className="flex items-center gap-5 mt-2">
                              <p>$ {item.price}</p>
                              <p className="px-3 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            updateQuantity(item.product, value);
                          }
                        }}
                        className="border sm:max-w-20 p-2 justify-center items-center"
                      />
                      <img
                        src={assets.bin_icon}
                        className="w-4 mt-3 mr-4 sm:w-5 cursor-pointer"
                        alt=""
                        onClick={() => removeFromCart(item.product)}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={() => navigate('/collection')}
                  className="mt-4 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>$ {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>$ 10.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>$ {(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>$ {(getCartTotal() + 10 + getCartTotal() * 0.1).toFixed(2)}</span>
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