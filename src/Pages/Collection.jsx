import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import Productitem from "../Components/productitem";
import Title from "../Components/Title";
import { useShop } from "../Context/shopcontext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Collection = () => {
  const { products, currency, addtocart } = useShop();
  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sort, setSort] = useState('relevant');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const brands = ['Nike', 'Adidas', 'Puma', 'Under Armour', 'New Balance'];

  // Initialize filtered products when products change
  useEffect(() => {
    if (products && products.length > 0) {
      setFilteredProducts(products);
      setIsLoading(false);
    }
  }, [products]);

  const toggleArrayItem = (array, setArray, value) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const applyFilters = () => {
    if (!products) return;
    
    let productscopy = products.slice();
    
    if (showSearch && search) {
      productscopy = productscopy.filter((item) => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category.length > 0) {
      productscopy = productscopy.filter((item) =>
        category.includes(item.category)
      );
    }
    
    if (subCategory.length > 0) {
      productscopy = productscopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    if (selectedSizes.length > 0) {
      productscopy = productscopy.filter((item) =>
        selectedSizes.some(size => item.sizes?.includes(size))
      );
    }

    if (selectedBrands.length > 0) {
      productscopy = productscopy.filter((item) =>
        selectedBrands.includes(item.brand)
      );
    }

    productscopy = productscopy.filter((item) =>
      item.price >= priceRange.min && item.price <= priceRange.max
    );

    setFilteredProducts(productscopy);
  };

  const handleSortChange = () => {
    if (!filteredProducts) return;
    
    let fpcopy = filteredProducts.slice();
    switch (sort) {
      case 'low-high':
        setFilteredProducts(fpcopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilteredProducts(fpcopy.sort((a, b) => b.price - a.price));
        break;
      case 'newest':
        setFilteredProducts(fpcopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        break;
      default:
        applyFilters();
        break;
    }
  };

  useEffect(() => {
    applyFilters();
  }, [category, subCategory, search, showSearch, selectedSizes, selectedBrands, priceRange]);

  useEffect(() => {
    handleSortChange();
  }, [sort]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h2>
          <p className="text-gray-600">Please try again later or check your internet connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <Title text1="All" text2="Collection" />
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="relevant">Sort By: Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="lg:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <div className={`space-y-6 ${showFilter ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <h4 className="font-medium mb-3">Search</h4>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange.min}</span>
                      <span>${priceRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {['Women', 'Men', 'Kids'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={category.includes(cat)}
                          onChange={() => toggleArrayItem(category, setCategory, cat)}
                          className="rounded text-gray-600"
                        />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subcategories */}
                <div>
                  <h4 className="font-medium mb-3">Type</h4>
                  <div className="space-y-2">
                    {['Bottomwear', 'Topwear', 'Winterwear'].map((subcat) => (
                      <label key={subcat} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={subCategory.includes(subcat)}
                          onChange={() => toggleArrayItem(subCategory, setSubCategory, subcat)}
                          className="rounded text-gray-600"
                        />
                        <span className="text-sm">{subcat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="font-medium mb-3">Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleArrayItem(selectedSizes, setSelectedSizes, size)}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          selectedSizes.includes(size)
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="font-medium mb-3">Brands</h4>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleArrayItem(selectedBrands, setSelectedBrands, brand)}
                          className="rounded text-gray-600"
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredProducts.length} products
            </div>
            <div className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            } gap-6`}>
              {filteredProducts.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <Link to={`/product/${item._id}`} className="block w-full">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-2">{item.brand}</p>
                      <p className="font-semibold text-gray-900">{currency} {item.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
