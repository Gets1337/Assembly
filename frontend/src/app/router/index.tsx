import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../modules/auth/pages/Login';
import Register from '../../modules/auth/pages/Register';
import { useAuthStore } from "../../modules/auth/stores/authStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    return <>{children}</>;
  };
  
  const Dashboard = () => {
    const { user, logout } = useAuthStore();
    
    return (
      <div style={{ padding: '20px' }}>
        <button onClick={logout}>Выйти</button>
      </div>
    );
  };

const Router: React.FC = () => {
    return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    )
};

export default Router;