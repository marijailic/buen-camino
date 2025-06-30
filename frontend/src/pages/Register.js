// src/pages/Register.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCsrfCookie, register } from "../api/authApi";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};

        if (!firstName) {
            validationErrors.firstName = "First name is required.";
        } else if (firstName.length > 255) {
            validationErrors.firstName =
                "First name must be max 255 characters.";
        }

        if (!lastName) {
            validationErrors.lastName = "Last name is required.";
        } else if (lastName.length > 255) {
            validationErrors.lastName = "Last name must be max 255 characters.";
        }

        if (!email) {
            validationErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationErrors.email = "Email format is invalid.";
        } else if (email.length > 255) {
            validationErrors.email = "Email must be max 255 characters.";
        }

        if (!password) {
            validationErrors.password = "Password is required.";
        } else if (password.length < 8) {
            validationErrors.password =
                "Password must be at least 8 characters.";
        } else if (password.length > 255) {
            validationErrors.password = "Password must be max 255 characters.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            await getCsrfCookie();
            await register({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
            });

            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            setErrors({
                general: "Registration failed. Please check your data.",
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center">
                <img src="/icon.png" className="w-24 h-auto mb-4" alt="Logo" />
                <div className="text-2xl font-bold">BUEN CAMINO</div>
                <h2 className="text-l font-bold mb-6 text-center">Register</h2>
            </div>
            <div className="w-full max-w-md px-6 bg-white rounded text-black">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && (
                        <p className="text-red-500 text-sm">{errors.general}</p>
                    )}
                    <div>
                        <label
                            htmlFor="firstName"
                            className="block mb-1 font-medium"
                        >
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.firstName}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="lastName"
                            className="block mb-1 font-medium"
                        >
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.lastName}
                            </p>
                        )}
                    </div>
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
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
