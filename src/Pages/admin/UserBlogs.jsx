import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../Context/UserAuthContext';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const UserBlogs = () => {
  const { user } = useUserAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/blogs/user');
      console.log('User blogs response:', response.data);
      setBlogs(response.data);
    } catch (err) {
      console.error('Error fetching user blogs:', err);
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
        fetchUserBlogs();
      } catch (err) {
        console.error('Error deleting blog:', err);
        toast.error('Failed to delete blog');
      }
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">My Blogs</h1>
              <button
                onClick={() => navigate('/write-blog')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <FaPlus className="mr-2" />
                Write New Blog
              </button>
            </div>

            {blogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't written any blogs yet.</p>
                <button
                  onClick={() => navigate('/write-blog')}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Write Your First Blog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div key={blog._id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                    {blog.featuredImage && (
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                      <p className="text-gray-600 text-sm mb-4">
                        {blog.excerpt || blog.content.substring(0, 100) + '...'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/edit-blog/${blog._id}`)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBlogs; 