import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../Context/UserAuthContext';
import { useAdminAuth } from '../Context/AdminAuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading: userLoading } = useUserAuth();
  const { admin, loading: adminLoading } = useAdminAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (userLoading || adminLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (requireAdmin) {
    if (!admin) {
      // Save the attempted URL for redirecting after login
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  } else {
    if (!user) {
      // Save the attempted URL for redirecting after login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;