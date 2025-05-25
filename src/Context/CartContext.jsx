import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useUserAuth } from './UserAuthContext';
import api from '../utils/axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useUserAuth();

  // Load cart on mount and when user changes
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      if (user) {
        // Load cart from API for logged-in users
        const response = await api.get('/api/cart');
        if (response.data && Array.isArray(response.data)) {
          setCart(response.data);
        } else {
          setCart([]);
        }
      } else {
        // Load cart from localStorage for guest users
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              setCart(parsedCart);
            } else {
              setCart([]);
            }
          } catch (error) {
            console.error('Error parsing cart data:', error);
            setCart([]);
          }
        } else {
          setCart([]);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    }
  };

  const addToCart = async (item) => {
    try {
      if (user) {
        // Add to cart in database for logged-in users
        const productId = item._id || item.productId || item.product;
        if (!productId) {
          toast.error('Invalid product ID');
          return;
        }

        const response = await api.post('/api/cart', {
          product: productId,
          quantity: item.quantity || 1,
          price: item.price,
          name: item.name,
          image: item.image,
          size: item.size || 'M'
        });
        
        if (response.data && Array.isArray(response.data)) {
          setCart(response.data);
          toast.success('Item added to cart');
        }
      } else {
        // Add to cart in localStorage for guest users
        const productId = item._id || item.productId || item.product;
        if (!productId) {
          toast.error('Invalid product ID');
          return;
        }

        const existingItem = cart.find(
          cartItem => cartItem.product === productId
        );

        let updatedCart;
        if (existingItem) {
          updatedCart = cart.map(cartItem =>
            cartItem.product === productId
              ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
              : cartItem
          );
        } else {
          updatedCart = [...cart, {
            product: productId,
            quantity: item.quantity || 1,
            price: item.price,
            name: item.name,
            image: item.image,
            size: item.size || 'M'
          }];
        }
        
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Item added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user) {
        // Remove from cart in database for logged-in users
        const response = await api.delete(`/api/cart/${productId}`);
        if (response.data && Array.isArray(response.data)) {
          setCart(response.data);
          toast.success('Item removed from cart');
        }
      } else {
        // Remove from cart in localStorage for guest users
        const updatedCart = cart.filter(item => item.product !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Item removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (user) {
        // Update quantity in database for logged-in users
        const response = await api.put(`/api/cart/${productId}`, { quantity });
        if (response.data && Array.isArray(response.data)) {
          setCart(response.data);
        }
      } else {
        // Update quantity in localStorage for guest users
        const updatedCart = cart.map(item =>
          item.product === productId ? { ...item, quantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await api.delete('/api/cart');
      }
      setCart([]);
      localStorage.removeItem('cart');
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || item.price;
      const quantity = item.quantity;
      return total + (price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleOrderComplete = async () => {
    try {
      if (user) {
        await api.delete('/api/cart');
      }
      setCart([]);
      localStorage.removeItem('cart');
      localStorage.removeItem('checkoutData');
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error clearing cart after order:', error);
      toast.error('Error clearing cart after order');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        handleOrderComplete
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default CartContext; 