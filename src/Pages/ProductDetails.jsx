import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useUserAuth } from '../Context/UserAuthContext';
import { toast } from 'react-toastify';
import axios from '../utils/axios';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaBolt } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUserAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        toast.error('Failed to fetch product details');
        navigate('/collection');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    addToCart(product, quantity);
    toast.success('Added to cart successfully');
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/wishlist', {
        productId: id,
      });
      toast.success('Product added to wishlist successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product to wishlist');
    }
  };

  const handleBuyNow = async () => {
    try {
      if (product.stock === 0) {
        toast.error('Product is out of stock');
        return;
      }

      const cartItem = {
        productId: product._id,
        quantity: quantity
      };

      await addToCart(cartItem);
      navigate('/place-order');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label htmlFor="quantity" className="font-medium">
              Quantity:
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded-md px-3 py-2"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <FaShoppingCart />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <FaBolt />
              Buy Now
            </button>
          </div>

          <button
            onClick={handleAddToWishlist}
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <FaHeart />
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 