import React from "react";
import { Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import { Login, Register } from "../../modules/auth";
import { HomePage } from "../../modules/user-interface/pages/home-page";
import { CartPage } from "../../modules/user-interface/pages/cart-page";
import { OrdersPage } from "../../modules/user-interface/pages/orders-page";
import { WorkerPage } from "../../modules/worker-interface/pages/worker-page";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuthStore } from "../../modules/auth/stores/auth-store";
import { UserLayout } from "../../modules/user-interface/components/user-layout";

const Router: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route
                    path="/"
                    element={
                        <ProtectedRoute restrictedRole="worker">
                            <UserLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/store" replace />} />
                    <Route path="store" element={<HomePage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                </Route>

                <Route
                    path="/worker"
                    element={
                        <ProtectedRoute requiredRole="worker">
                            <WorkerPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
};

export {Router};