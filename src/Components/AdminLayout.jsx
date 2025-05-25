import { Link, useLocation, Outlet } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiUsers, FiSettings, FiLogOut, FiFileText, FiShoppingCart } from 'react-icons/fi';
import { useAdminAuth } from '../Context/AdminAuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAdminAuth();

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
    { path: '/admin/products', icon: FiShoppingBag, label: 'Products' },
    { path: '/admin/blogs', icon: FiFileText, label: 'Blogs' },
    { path: '/admin/customers', icon: FiUsers, label: 'Users' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center mt-12 justify-center h-20 border-b">
            <h1 className="text-2xl font-bold text-black">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gray-100 text-black shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive(item.path) ? 'text-black' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm group"
            >
              <FiLogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content with Sidebar Offset */}
      <main className="flex-1 ml-72">
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 