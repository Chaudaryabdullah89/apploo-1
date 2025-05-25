import React, { useState } from 'react';
import axios from 'axios';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('');
    
    console.log('Attempting to subscribe with email:', email);
    
    try {
      console.log('Making POST request to:', 'http://localhost:5000/api/users/newsletter/subscribe');
      const response = await axios.post('http://localhost:5000/api/users/newsletter/subscribe', { email });
      console.log('Response received:', response);
      if (response.data.message) {
      setStatus('success');
      setEmail('');
      }
    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error request:', err.request);
      console.error('Error config:', err.config);
      setError(err.response?.data?.error || 'Failed to subscribe to newsletter. Please try again.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new collections,
            special offers, and exclusive events.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 transform hover:scale-[1.02] transition-transform duration-300">
            <form onSubmit={onSubmitHandler} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    required
                    disabled={loading}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Subscribing...</span>
                    </div>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>

              {status === 'success' && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400 animate-fade-in">
                  Thank you for subscribing! Please check your email to confirm.
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400 animate-fade-in">
                  {error}
                </div>
              )}

              <p className="text-sm text-gray-400">
                By subscribing, you agree to our Privacy Policy and consent to receive
                updates from our company.
              </p>
            </form>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">10k+</div>
                <div className="text-gray-400">Subscribers</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">20%</div>
                <div className="text-gray-400">Discount</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Weekly</div>
                <div className="text-gray-400">Updates</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;