import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuthStore } from '../../modules/auth/stores/auth-store';
import { Box, CircularProgress } from '@mui/joy';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'worker' | 'admin';
  restrictedRole?: 'user' | 'worker' | 'admin';
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  restrictedRole,
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (!requireAuth) {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (restrictedRole && user.role === restrictedRole) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/worker" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/store" replace />;
  }

  return <>{children}</>;
}; 