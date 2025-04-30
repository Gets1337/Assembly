import React from "react";
import { Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import Login from '../../modules/auth/pages/Login';
import Register from '../../modules/auth/pages/Register';
import { Dashboard, ProtectedRoute } from "../../modules/auth/pages/Dashboard";


const Router: React.FC = () => {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    )
};

export {Router};