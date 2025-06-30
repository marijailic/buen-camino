// src/pages/Login.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCsrfCookie, login } from "../api/authApi";
import { useAuth } from "../context/auth/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { authLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!email) {
            validationErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationErrors.email = "Email format is invalid.";
        }
        if (!password) {
            validationErrors.password = "Password is required.";
        } else if (password.length < 8) {
            validationErrors.password =
                "Password must be at least 8 characters.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            await getCsrfCookie();
            const response = await login({ email, password });
            const accessToken = response.data.access_token;

            authLogin(accessToken);
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
            setErrors({ general: "Invalid credentials." });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center">
                <img src="/icon.png" className="w-24 h-auto mb-4" alt="Logo" />
                <div className="text-2xl font-bold">BUEN CAMINO</div>
                <h2 className="text-l font-bold mb-6 text-center">Login</h2>
            </div>
            <div className="w-full max-w-md px-6 bg-white rounded text-black">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && (
                        <p className="text-red-500 text-sm">{errors.general}</p>
                    )}
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-1 font-medium"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-1 font-medium"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
