// src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";

import ProtectedRoute from "./context/auth/ProtectedRoute";
import PublicRoute from "./context/auth/PublicRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";

import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Route */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    {/* Protected Routes */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <ProtectedLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/home" element={<Home />} />
                        {/* Add more protected routes here */}
                    </Route>

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
