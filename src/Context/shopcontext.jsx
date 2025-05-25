import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const shopContext = createContext(null);

export const useShop = () => {
  const context = useContext(shopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopContextProvider');
  }
  return context;
};

const getDefaultCart = () => {
  return {};
};

export const ShopContextProvider = (props) => {
  const currency = '$';
  const delivery_fee = 10;
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showsearch, setShowsearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : getDefaultCart();
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/products');
      console.log('Products response:', response.data);
      
      // Ensure image URLs are properly formatted
      const formattedProducts = response.data.map(product => {
        let imageUrl;
        
        if (product.image) {
          if (typeof product.image === 'string') {
            if (product.image.startsWith('http')) {
              imageUrl = product.image;
            } else if (product.image.startsWith('/')) {
              imageUrl = `http://localhost:5000${product.image}`;
            } else {
              imageUrl = `http://localhost:5000/uploads/${product.image}`;
            }
          } else if (typeof product.image === 'object') {
            imageUrl = product.image.url || product.image.path;
          }
        }
        
        if (!imageUrl || imageUrl.length < 5) {
          console.warn('No valid image URL found for product:', product.name);
          imageUrl = '/placeholder.png';
        }
        
        return {
          ...product,
          image: imageUrl
        };
      });
      
      setProducts(formattedProducts);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err);
      toast.error('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      throw error;
    }
  };

  const getProductsByCategory = async (category) => {
    try {
      const response = await api.get(`/api/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      toast.error('Failed to load products');
      throw error;
    }
  };

  const searchProducts = async (query) => {
    try {
      const response = await api.get(`/api/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
      throw error;
    }
  };

  const addtocart = (itemid, size = 'default') => {
    setCartItems(prevCart => {
      const newCart = { ...prevCart };
      if (!newCart[itemid]) {
        newCart[itemid] = {};
      }
      if (newCart[itemid][size]) {
        newCart[itemid][size] += 1;
      } else {
        newCart[itemid][size] = 1;
      }
      return newCart;
    });
    toast.success('Item added to cart');
  };

  const getCartCount = () => {
    let totalCount = 0;
    Object.values(cartItems).forEach(sizes => {
      Object.values(sizes).forEach(quantity => {
        totalCount += quantity;
      });
    });
    return totalCount;
  };

  const updatequantity = (itemid, size, quantity) => {
    setCartItems(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[itemid]) {
        if (quantity <= 0) {
          delete newCart[itemid][size];
          if (Object.keys(newCart[itemid]).length === 0) {
            delete newCart[itemid];
          }
        } else {
          newCart[itemid][size] = quantity;
        }
      }
      return newCart;
    });
  };

  const getTotalCartAmount = () => {
    let total = 0;
    Object.entries(cartItems).forEach(([productId, sizes]) => {
      const product = products.find(p => p._id === productId);
      if (product) {
        Object.entries(sizes).forEach(([size, quantity]) => {
          total += product.price * quantity;
        });
      }
    });
    return total;
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showsearch,
    setShowsearch,
    cartItems,
    addtocart,
    getCartCount,
    updatequantity,
    getTotalCartAmount,
    isLoading,
    error,
    fetchProducts,
    getProductById,
    getProductsByCategory,
    searchProducts
  };

  return (
    <shopContext.Provider value={value}>
      {props.children}
    </shopContext.Provider>
  );
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ShopContextProvider;