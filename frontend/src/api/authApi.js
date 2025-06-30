// src/api/authApi.js

import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getCsrfCookie = () => {
    return axios.get(`${backendUrl}/sanctum/csrf-cookie`);
};

export const register = async (data) => {
    return await axios.post(`${backendUrl}/api/register`, data);
};

export const login = async ({ email, password }) => {
    return await axios.post(`${backendUrl}/api/login`, { email, password });
};

export const logout = async (token) => {
    return await axios.post(
        `${backendUrl}/api/logout`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );
};
