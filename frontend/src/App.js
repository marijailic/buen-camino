// src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import PublicRoute from "./utils/auth/PublicRoute";
import ProtectedRoute from "./utils/auth/ProtectedRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";

import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MyProfile from "./pages/MyProfile";
import Conversations from "./pages/Conversations";
import Conversation from "./pages/Conversation";
import NotFound from "./pages/NotFound";

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <Welcome />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />
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
                        <Route path="/profile/:userId" element={<Profile />} />
                        <Route path="/my-profile" element={<MyProfile />} />
                        <Route
                            path="/conversations"
                            element={<Conversations />}
                        />
                        <Route
                            path="/conversation/:userId"
                            element={<Conversation />}
                        />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
