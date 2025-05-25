import { useState } from 'react';
import { motion } from 'framer-motion';

const Wishlist = ({ items, onRemove, onAddToCart }) => {
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');

  const sortItems = (items) => {
    switch (sortBy) {
      case 'price-asc':
        return [...items].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...items].sort((a, b) => b.price - a.price);
      case 'name':
        return [...items].sort((a, b) => a.name.localeCompare(b.name));
      case 'date':
      default:
        return [...items].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    }
  };

  const filterItems = (items) => {
    switch (filterBy) {
      case 'in-stock':
        return items.filter(item => item.inStock);
      case 'on-sale':
        return items.filter(item => item.onSale);
      default:
        return items;
    }
  };

  const sortedAndFilteredItems = filterItems(sortItems(items));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
          >
            <option value="date">Date Added</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
          >
            <option value="all">All Items</option>
            <option value="in-stock">In Stock</option>
            <option value="on-sale">On Sale</option>
          </select>
        </div>

        <p className="text-sm text-gray-500">
          {sortedAndFilteredItems.length} items in wishlist
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredItems.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg overflow-hidden"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              {item.onSale && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                  Sale
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{item.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-gray-900 font-medium">${item.price.toFixed(2)}</p>
                {item.originalPrice && (
                  <p className="text-gray-500 line-through text-sm">
                    ${item.originalPrice.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAddToCart(item)}
                  disabled={!item.inStock}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    item.inStock
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={() => onRemove(item._id)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedAndFilteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Your wishlist is empty</p>
        </div>
      )}
    </div>
  );
};

export default Wishlist; 