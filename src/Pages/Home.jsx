import React, { useEffect, useState } from 'react';
import { useShop } from '../Context/shopcontext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/axios';
import Hero from '../Components/hero'
import Newsletter from '../Components/Newsletter'
import Policy from '../Components/Policy'
import FeaturedCategories from '../Components/FeaturedCategories'

const Home = () => {
  const { products, isLoading, error } = useShop();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/api/products?featured=true');
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        toast.error('Failed to load featured products');
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error.message || 'An error occurred'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero />
    <div className="container mx-auto px-4 py-8">
      
      {/* Main Content Section */}
      <div className="bg-white">
        <FeaturedCategories />
        
        {/* Featured Products Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">${product.price}</p>
                    <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Products Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">All Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">${product.price}</p>
                    <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Social Proof Section */}
      <div className="bg-gray-50">
        {/* <Testimonials /> */}
        {/* <Brands /> */}
      </div>

      {/* Trust & Newsletter Section */}
      <div className="bg-white">
        <Policy />
      </div>
    </div>
        <Newsletter />
    </>
  );
};

export default Home;