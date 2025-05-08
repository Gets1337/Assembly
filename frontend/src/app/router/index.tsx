import React from "react";
import { Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import { Login, Register } from "../../modules/auth";
import { HomePage } from "../../modules/user-interface";
import { ProtectedRoute } from "../components/ProtectedRoute";

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/store"
                    element={
                        <HomePage/>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/store" />} />
            </Routes>
        </BrowserRouter>
    )
};

export {Router};