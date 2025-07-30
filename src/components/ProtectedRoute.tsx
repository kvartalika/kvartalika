import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'CM';
  redirectTo?: string;
}

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/auth' }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      // Redirect based on user role
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      return;
    }
  }, [isAuthenticated, user, requiredRole, navigate, redirectTo]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;