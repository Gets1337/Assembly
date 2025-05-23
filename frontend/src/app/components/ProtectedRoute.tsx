import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'worker';
  restrictedRole?: 'user' | 'worker';
}

export const ProtectedRoute = ({ children, requiredRole, restrictedRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (restrictedRole && userRole === restrictedRole) {
    return <Navigate to="/worker" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/store" replace />;
  }

  return <>{children}</>;
}; 