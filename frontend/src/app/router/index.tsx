import React from "react";
import { Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import Login from '../../modules/auth/pages/login';
import Register from "../../modules/auth/pages/register";
import { HomePage } from "../../modules/user-interface/pages/home-page";

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
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
};

export {Router};