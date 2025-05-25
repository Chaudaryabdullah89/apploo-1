import React from 'react';
import { Link } from 'react-router-dom';
import Title from './Title';

const FeaturedCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Women\'s Fashion',
      image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3',
      count: '120+ Products',
      description: 'Discover the latest trends in women\'s fashion'
    },
    {
      id: 2,
      name: 'Men\'s Fashion',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3',
      count: '90+ Products',
      description: 'Explore our premium men\'s collection'
    },
    {
      id: 3,
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3',
      count: '50+ Products',
      description: 'Complete your look with our accessories'
    },
    {
      id: 4,
      name: 'Footwear',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3',
      count: '75+ Products',
      description: 'Step into style with our footwear collection'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Title text1="Featured" text2="Categories" />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore our carefully curated categories featuring the latest trends and timeless classics
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {categories.map((category) => (
            <Link 
              to={`/collection/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              key={category.id}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-80 mb-2">{category.count}</p>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium">
                      Shop Now
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories; 