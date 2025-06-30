// src/api/authApi.js

import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getCsrfCookie = () => {
    return axios.get(`${backendUrl}/sanctum/csrf-cookie`);
};

export const login = async ({ email, password }) => {
    return await axios.post(`${backendUrl}/api/login`, { email, password });
};
