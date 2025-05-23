import React from "react";
import { Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import { Login, Register } from "../../modules/auth";
import { HomePage } from "../../modules/user-interface";
import { WorkerPage } from "../../modules/worker-interface/pages/worker-page";
import { ProtectedRoute } from "../components/ProtectedRoute";

const Router: React.FC = () => {
    const userRole = localStorage.getItem('userRole');

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/store"
                    element={
                        <ProtectedRoute restrictedRole="worker">
                            <HomePage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute restrictedRole="worker">
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute restrictedRole="worker">
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/worker"
                    element={
                        <ProtectedRoute requiredRole="worker">
                            <WorkerPage />
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/" 
                    element={
                        userRole === 'worker' 
                            ? <Navigate to="/worker" replace />
                            : <Navigate to="/store" replace />
                    } 
                />
            </Routes>
        </BrowserRouter>
    )
};

export {Router};