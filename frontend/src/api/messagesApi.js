// src/api/messagesApi.js

import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getAllReceivers = (token) => {
    return axios.get(`${backendUrl}/api/messages/get-all-receivers`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
};
