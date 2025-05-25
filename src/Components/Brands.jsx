import React from 'react';
import Title from './Title';

const Brands = () => {
  const brands = [
    {
      id: 1,
      name: 'Nike',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
      description: 'Just Do It'
    },
    {
      id: 2,
      name: 'Adidas',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
      description: 'Impossible Is Nothing'
    },
    {
      id: 3,
      name: 'Puma',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Puma_logo.svg',
      description: 'Forever Faster'
    },
    {
      id: 4,
      name: 'Under Armour',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Under_Armour_logo.svg',
      description: 'The Only Way Is Through'
    },
    {
      id: 5,
      name: 'New Balance',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/New_Balance_logo.svg',
      description: 'Fearlessly Independent'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <Title text1="Our" text2="Brands" />
        <p className="text-center text-gray-600 mt-4 mb-12 max-w-2xl mx-auto">
          We partner with the world's leading brands to bring you the best quality products
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group relative flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-12 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-medium text-gray-600">{brand.description}</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Trusted by millions of customers worldwide</p>
          <div className="flex justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>4.8/5 Rating</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>1M+ Customers</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands; 