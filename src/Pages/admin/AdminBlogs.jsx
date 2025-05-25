import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../Context/AdminAuthContext';
import { FiEdit2, FiTrash2, FiEye, FiCheck, FiX } from 'react-icons/fi';
import DeleteConfirmation from '../../Components/DeleteConfirmation';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminBlogs = () => {
  const { admin } = useAdminAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    pending: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    blogId: null,
    blogTitle: ''
  });

  const categories = ['Technology', 'Fashion', 'Lifestyle', 'Travel', 'Food', 'Other'];
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm, selectedStatus, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/blogs', {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
          category: selectedCategory,
          status: selectedStatus,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });

      const blogsData = response.data.blogs || response.data;
      setBlogs(blogsData);

      const stats = {
        total: blogsData.length,
        published: blogsData.filter(blog => blog.status === 'published').length,
        drafts: blogsData.filter(blog => blog.status === 'draft').length,
        pending: blogsData.filter(blog => blog.status === 'pending').length,
        totalViews: blogsData.reduce((sum, blog) => sum + (blog.views || 0), 0),
        totalLikes: blogsData.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0)
      };
      setStats(stats);

      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      const errorMessage = err.response?.data?.message || 'Error fetching blogs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/api/blogs/${id}`);
        toast.success('Blog deleted successfully');
        fetchBlogs();
        setDeleteModal({ isOpen: false, blogId: null, blogTitle: '' });
      } catch (err) {
        console.error('Error deleting blog:', err);
        toast.error('Failed to delete blog');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/blogs/${id}`, { status: newStatus });
      toast.success(`Blog ${newStatus} successfully`);
      fetchBlogs();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update blog status';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating blog status:', err);
    }
  };

  const openDeleteModal = (blog) => {
    setDeleteModal({
      isOpen: true,
      blogId: blog._id,
      blogTitle: blog.title
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-50xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setLoading(true);
                    fetchBlogs();
                  }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                  title="Refresh Blogs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => navigate('/admin/blogs/add')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  <FaPlus className="mr-2" />
                  Add New Blog
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Total Blogs</h3>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Published</h3>
                <p className="text-2xl font-bold text-green-500">{stats.published}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Drafts</h3>
                <p className="text-2xl font-bold text-yellow-500">{stats.drafts}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Pending</h3>
                <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Total Views</h3>
                <p className="text-2xl font-bold text-blue-500">{stats.totalViews}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500 text-sm">Total Likes</h3>
                <p className="text-2xl font-bold text-pink-500">{stats.totalLikes}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search blogs..."
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Blog List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {blog.featuredImage && (
                            <img
                              src={`http://localhost:5000${blog.featuredImage}`}
                              alt={blog.title}
                              className="h-10 w-10 rounded-lg object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                            <div className="text-sm text-gray-500">{blog.author?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : blog.status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {blog.views || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {blog.likes?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                          >
                            <FiEye className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/admin/blogs/edit/${blog._id}`}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Edit"
                          >
                            <FaEdit className="h-5 w-5" />
                          </Link>
                          {blog.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(blog._id, 'published')}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <FiCheck className="h-5 w-5" />
                            </button>
                          )}
                          {blog.status === 'draft' && (
                            <button
                              onClick={() => handleStatusChange(blog._id, 'published')}
                              className="text-green-600 hover:text-green-900"
                              title="Publish"
                            >
                              <FiCheck className="h-5 w-5" />
                            </button>
                          )}
                          {blog.status === 'published' && (
                            <button
                              onClick={() => handleStatusChange(blog._id, 'draft')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Unpublish"
                            >
                              <FiX className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteModal(blog)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
              isOpen={deleteModal.isOpen}
              onClose={() => setDeleteModal({ isOpen: false, blogId: null, blogTitle: '' })}
              onConfirm={() => handleDelete(deleteModal.blogId)}
              title="Delete Blog Post"
              message={`Are you sure you want to delete "${deleteModal.blogTitle}"? This action cannot be undone.`}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs; 