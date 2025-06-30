// src/api/usersApi.js

import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getUsers = (token) => {
    return axios.get(`${backendUrl}/api/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
};

export const updateLocation = (token, location) => {
    return axios.post(`${backendUrl}/api/users/update-location`, location, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
};
