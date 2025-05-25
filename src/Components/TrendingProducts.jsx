import React, { useEffect, useState } from 'react';
import { useShop } from '../Context/shopcontext';
import Productitem from './productitem';
import Title from './Title';

const TrendingProducts = () => {
  const { products, currency, addtocart } = useShop();
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch trending products from your backend
    // For now, we'll just take the first 8 products
    setTrendingProducts(products.slice(0, 8));
  }, [products]);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Title text1="Trending" text2="Products" />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
            Discover our most popular and trending products that customers love. 
            Stay ahead of the fashion curve with our carefully curated selection.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product, index) => (
            <div key={index} className="group transform transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <Productitem
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    image={product.image[0]}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-110">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-110">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">(120)</span>
                    </div>
                    <button className="text-sm text-gray-600 hover:text-black transition-colors">
                      Add to Wishlist
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Free Shipping</span>
                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts; 