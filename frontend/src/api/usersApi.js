// src/api/usersApi.js

import axios from "axios";
import { getAuthHeaders } from "./apiUtils";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getUsers = (token) => {
    return axios.get(`${backendUrl}/api/users`, getAuthHeaders(token));
};

export const getUser = (token, userId) => {
    return axios.get(
        `${backendUrl}/api/users/${userId}`,
        getAuthHeaders(token)
    );
};

export const updateLocation = (token, location) => {
    return axios.post(
        `${backendUrl}/api/users/update-location`,
        location,
        getAuthHeaders(token)
    );
};
