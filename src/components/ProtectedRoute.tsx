import {type ReactNode, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthStore, type UserRole} from "../store/auth.store.ts";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

const normalizeRoles = (r?: UserRole | UserRole[]): UserRole[] | undefined => {
  if (!r) return undefined;
  return Array.isArray(r) ? r : [r];
};

const ProtectedRoute = ({
                          children,
                          requiredRole,
                          redirectTo = '/auth'
                        }: ProtectedRouteProps) => {
  const {isAuthenticated, role} = useAuthStore();
  const navigate = useNavigate();
  const roles = normalizeRoles(requiredRole);

  useEffect(() => {

    if (!isAuthenticated) {
      navigate(redirectTo, {replace: true});
      return;
    }

    if (roles && !roles.includes(role as UserRole)) {
      if (role === 'ADMIN') {
        navigate('/admin', {replace: true});
      } else {
        navigate('/', {replace: true});
      }
    }
  }, [isAuthenticated, role, roles, navigate, redirectTo]);

  if (!isAuthenticated) {
    return null;
  }

  if (roles && !roles.includes(role as UserRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;