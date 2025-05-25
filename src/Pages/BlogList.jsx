import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useUserAuth } from '../Context/UserAuthContext';
import { toast } from 'react-toastify';
import { FaTags } from 'react-icons/fa';
import axios from '../utils/axios'; // Use the configured axios instance

const BlogList = () => {
  const { user } = useUserAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const categories = ['Technology', 'Fashion', 'Lifestyle', 'Travel', 'Food', 'Other'];

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm, selectedTag]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedTag && { tag: selectedTag })
      });

      // Add status parameter based on user role
      if (user?.role === 'admin') {
        params.append('status', 'all');
      } else {
        params.append('status', 'published');
      }

      console.log('Fetching blogs with params:', params.toString());
      console.log('User role:', user?.role);
      
      const response = await axios.get(`/api/blogs?${params}`);
      console.log('Full API Response:', response);
      console.log('Blogs data:', response.data);

      if (response.data && Array.isArray(response.data.blogs)) {
        console.log('Number of blogs received:', response.data.blogs.length);
        console.log('Blog statuses:', response.data.blogs.map(blog => blog.status));
        setBlogs(response.data.blogs);
        setTotalPages(response.data.totalPages || 1);
        setError(null);

        // Extract unique tags from all blogs
        const allTags = response.data.blogs.reduce((acc, blog) => {
          if (blog.tags) {
            const blogTags = Array.isArray(blog.tags) 
              ? blog.tags 
              : blog.tags.split(',').map(tag => tag.trim());
            return [...acc, ...blogTags];
          }
          return acc;
        }, []);
        setTags([...new Set(allTags)]);
      } else {
        console.log('No blogs array in response:', response.data);
        setBlogs([]);
        setError('No blogs found');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError('Failed to fetch blogs');
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const handleTagChange = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-gray-600">Discover the latest articles and insights</p>
        {user && (
          <button
            onClick={() => navigate('/write-blog')}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Write a Blog Post
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blogs..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <FiSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Search
          </button>
        </form>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedTag('')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              !selectedTag ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedTag === tag ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaTags className="text-xs" />
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No blogs found.</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {blog.featuredImage && (
                <img
                  src={blog.featuredImage.startsWith('http') 
                    ? blog.featuredImage 
                    : `${import.meta.env.VITE_API_URL || ''}${blog.featuredImage}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {blog.category}
                  </span>
                  {blog.status === 'pending' && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      Pending Review
                    </span>
                  )}
                  {blog.status === 'draft' && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Draft
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={blog.author?.avatar || 'https://via.placeholder.com/40'}
                      alt={blog.author?.name}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                      <p className="text-sm font-medium">{blog.author?.name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-black hover:text-gray-700 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BlogList; 