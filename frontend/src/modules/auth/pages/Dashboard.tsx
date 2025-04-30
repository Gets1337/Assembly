import React from "react";
import { Navigate} from 'react-router-dom';
import { useAuthStore } from "../stores/authStore";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    return <>{children}</>;
  };
  
export const Dashboard = () => {
    const { user, logout } = useAuthStore();
    
    return (
      <div style={{ padding: '20px' }}>
        <button onClick={logout}>Выйти</button>
      </div>
    );
  };