// src/api/authApi.js

import axios from "axios";
import { getAuthHeaders } from "./apiUtils";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getCsrfCookie = () => {
    return axios.get(`${backendUrl}/sanctum/csrf-cookie`);
};

export const register = ({ first_name, last_name, email, password }) => {
    return axios.post(`${backendUrl}/api/register`, {
        first_name,
        last_name,
        email,
        password,
    });
};

export const login = ({ email, password }) => {
    return axios.post(`${backendUrl}/api/login`, { email, password });
};

export const logout = (token) => {
    return axios.post(`${backendUrl}/api/logout`, {}, getAuthHeaders(token));
};
