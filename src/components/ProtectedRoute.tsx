import {type ReactNode, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthStore, type UserRole} from "../store";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute = ({
                          children,
                          requiredRole,
                          redirectTo = '/auth'
                        }: ProtectedRouteProps) => {
  const {isAuthenticated, role} = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
      return;
    }

    if (requiredRole && role !== requiredRole) {
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      return;
    }
  }, [isAuthenticated, role, requiredRole, navigate, redirectTo]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;