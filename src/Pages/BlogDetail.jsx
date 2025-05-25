import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../Context/UserAuthContext';
import { toast } from 'react-toastify';
import axios from '../utils/axios';
import { FaHeart, FaComment, FaShare, FaTag } from 'react-icons/fa';
import { FiHeart, FiMessageSquare, FiShare2, FiClock, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${slug}`);
        setBlog(response.data);
        setLikes(response.data.likes || 0);
        setHasLiked(response.data.likedBy?.includes(user?._id));
        setRelatedBlogs(response.data.relatedBlogs || response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to fetch blog details');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, user?._id, navigate]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like this blog');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`/blogs/${blog._id}/like`);
      setLikes(response.data.likes);
      setHasLiked(response.data.hasLiked);
    } catch (error) {
      console.error('Error liking blog:', error);
      toast.error('Failed to like blog');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const response = await axios.post(`/blogs/${blog._id}/comment`, { content: comment });
      setBlog(response.data);
      setComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.content.substring(0, 100) + '...',
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">{error || 'Blog not found'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Blog Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <div className="flex items-center">
            <FiUser className="mr-2" />
            <span>{blog.author?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-2" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FiMessageSquare className="mr-2" />
            <span>{blog.comments?.length || 0} comments</span>
          </div>
        </div>
        {blog.featuredImage && (
          <img
            src={blog.featuredImage.startsWith('http') 
              ? blog.featuredImage 
              : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${blog.featuredImage}`}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        )}
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="prose prose-lg max-w-none">
          {blog.content}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {(Array.isArray(blog.tags) ? blog.tags : blog.tags.split(','))
              .map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                >
                  <FaTag className="text-xs" />
                  {tag.trim()}
                </Link>
              ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              hasLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiHeart className={hasLiked ? 'fill-current' : ''} />
            <span>{likes} Likes</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <FiShare2 />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        
        {/* Comment Form */}
        <form onSubmit={handleComment} className="mb-8">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-4"
            rows="4"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Post Comment
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {blog.comments?.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <FiUser className="text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{comment.author?.name || 'Anonymous'}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}

          {(!blog.comments || blog.comments.length === 0) && (
            <p className="text-gray-600 text-center py-8">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs
              .filter((relatedBlog) => relatedBlog._id !== blog._id)
              .map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  to={`/blog/${relatedBlog.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48">
                    <img
                      src={relatedBlog.featuredImage 
                        ? (relatedBlog.featuredImage.startsWith('http') 
                          ? relatedBlog.featuredImage 
                          : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${relatedBlog.featuredImage}`)
                        : '/placeholder-image.jpg'}
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{relatedBlog.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedBlog.excerpt}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail; 