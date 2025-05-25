import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useShop } from '../Context/shopcontext';

// Configure axios with base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

const CollectionPage = ({ collectionType }) => {
  const { products, currency, addtocart } = useShop();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    sizes: [],
    brands: [],
    sortBy: 'newest'
  });

  // Collection type configurations
  const collectionConfig = {
    mens: {
      title: "Men's Collection",
      description: "Discover our latest men's fashion collection featuring premium quality clothing and accessories.",
      categories: ['shirts', 'pants', 'jackets', 'accessories'],
      bannerImage: '/images/mens-collection-banner.jpg'
    },
    womens: {
      title: "Women's Collection",
      description: "Explore our elegant women's collection with the latest trends in fashion and style.",
      categories: ['dresses', 'tops', 'skirts', 'accessories'],
      bannerImage: '/images/womens-collection-banner.jpg'
    },
    footwear: {
      title: "Footwear Collection",
      description: "Step into style with our exclusive footwear collection for men and women.",
      categories: ['sneakers', 'formal', 'casual', 'sports'],
      bannerImage: '/images/footwear-collection-banner.jpg'
    },
    accessories: {
      title: "Accessories Collection",
      description: "Complete your look with our curated selection of premium accessories.",
      categories: ['bags', 'watches', 'jewelry', 'belts'],
      bannerImage: '/images/accessories-collection-banner.jpg'
    }
  };

  const config = collectionConfig[collectionType];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/products/collection/${collectionType}`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collectionType]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredProducts = products.filter(product => {
    // Apply price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Apply size filter
    if (filters.sizes.length > 0 && !product.sizes.some(size => filters.sizes.includes(size))) {
      return false;
    }

    // Apply brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[400px] bg-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{config.title}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">{config.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Filters</h2>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{currency} {filters.priceRange[0]}</span>
                    <span>{currency} {filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="space-y-2">
                  {config.categories.map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded text-gray-900"
                        onChange={(e) => {
                          const newSizes = e.target.checked
                            ? [...filters.sizes, category]
                            : filters.sizes.filter(s => s !== category);
                          handleFilterChange('sizes', newSizes);
                        }}
                      />
                      <span className="text-gray-600 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="relative aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-2">{product.brand}</p>
                      <p className="font-semibold text-gray-900">{currency} {product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage; 