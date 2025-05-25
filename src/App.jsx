import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { store } from './store/store';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Context Providers
import { UserAuthProvider } from './Context/UserAuthContext';
import { AdminAuthProvider } from './Context/AdminAuthContext';
import { CartProvider } from './Context/CartContext';
import { ShopContextProvider } from './Context/shopcontext';

// Components
import Navbar from './Components/navbar';
import Footer from './Components/Footer';
import Search from './Components/Search';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminLayout from './Components/AdminLayout';

// Pages
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import Collection from './Pages/Collection';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Order from './Pages/order';
import OrderSuccess from './Pages/OrderSuccess';
import BlogList from './Pages/BlogList';
import BlogDetail from './Pages/BlogDetail';
import WriteBlog from './Pages/WriteBlog';
import Dashboard from './Pages/Dashboard';
import AdminLogin from './Pages/admin/AdminLogin';
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminProducts from './Pages/admin/AdminProducts';
import AdminOrders from './Pages/admin/AdminOrders';
import AdminCustomers from './Pages/admin/AdminCustomers';
import AdminSettings from './Pages/admin/AdminSettings';
import AdminBlogs from './Pages/admin/AdminBlogs';
import AddBlog from './Pages/admin/AddBlog';
import AddProduct from './Pages/admin/AddProduct';
import EditProduct from './Pages/admin/EditProduct';
import Discounts from './Pages/admin/Discounts';
import ShippingMethods from './Pages/admin/ShippingMethods';
import NotFound from './Pages/NotFound';
import PlaceOrder from './Pages/PlaceOrder';
import EditBlog from './Pages/admin/EditBlog';
import UserBlogs from './Pages/admin/UserBlogs';

// Initialize React Query
const queryClient = new QueryClient();

// Initialize Stripe
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <UserAuthProvider>
            <AdminAuthProvider>
              <ShopContextProvider>
                <CartProvider>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <Search />
                    <main className="flex-grow">
                      <AnimatePresence mode="wait">
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<Home />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/collection" element={<Collection />} />
                          <Route path="/product/:id" element={<ProductDetails />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/blog" element={<BlogList />} />
                          <Route path="/blog/:slug" element={<BlogDetail />} />
                          <Route path="/place-order" element={<PlaceOrder />} />

                          {/* Protected User Routes */}
                          <Route
                            path="/profile"
                            element={
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/write-blog"
                            element={
                              <ProtectedRoute>
                                <WriteBlog />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/my-blogs"
                            element={
                              <ProtectedRoute>
                                <BlogList />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/edit-blog/:id"
                            element={
                              <ProtectedRoute>
                                <EditBlog />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/order"
                            element={
                              <ProtectedRoute>
                                <Order />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/checkout"
                            element={
                              <ProtectedRoute>
                                {stripePromise ? (
                                  <Elements stripe={stripePromise}>
                                    <Checkout />
                                  </Elements>
                                ) : (
                                  <div>Stripe is not configured</div>
                                )}
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/order-success"
                            element={
                              <ProtectedRoute>
                                <OrderSuccess />
                              </ProtectedRoute>
                            }
                          />

                          {/* Admin Routes */}
                          <Route path="/admin/login" element={<AdminLogin />} />
                          <Route
                            path="/admin"
                            element={
                              <ProtectedRoute requireAdmin>
                                <AdminLayout />
                              </ProtectedRoute>
                            }
                          >
                            <Route index element={<AdminDashboard />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="products/new" element={<AddProduct />} />
                            <Route path="products/edit/:id" element={<EditProduct />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="customers" element={<AdminCustomers />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="blogs" element={<AdminBlogs />} />
                            <Route path="blogs/add" element={<AddBlog />} />
                            <Route path="blogs/edit/:id" element={<EditBlog />} />
                            <Route path="discounts" element={<Discounts />} />
                            <Route path="shipping" element={<ShippingMethods />} />
                          </Route>

                          {/* 404 Route */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </AnimatePresence>
                    </main>
                    <Footer />
                  </div>
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
                </CartProvider>
              </ShopContextProvider>
            </AdminAuthProvider>
          </UserAuthProvider>
        </GoogleOAuthProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
