// src/pages/Register.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCsrfCookie, register } from "../api/authApi";
import { validateRegister } from "../utils/validation";

const Register = () => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateRegister(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            await getCsrfCookie();
            await register({
                first_name: form.firstName,
                last_name: form.lastName,
                email: form.email,
                password: form.password,
            });

            navigate("/login");
        } catch (error) {
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

                    {/* First Name */}
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
                            value={form.firstName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.firstName}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
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
                            value={form.lastName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.lastName}
                            </p>
                        )}
                    </div>

                    {/* Email */}
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
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
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
                            value={form.password}
                            onChange={handleChange}
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
