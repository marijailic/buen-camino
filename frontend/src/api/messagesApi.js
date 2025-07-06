// src/api/messagesApi.js

import axios from "axios";
import { getAuthHeaders } from "./apiUtils";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getByReciever = (token, userId) => {
    return axios.get(
        `${backendUrl}/api/messages/get-by-receiver/${userId}`,
        getAuthHeaders(token)
    );
};

export const getAllReceivers = (token) => {
    return axios.get(
        `${backendUrl}/api/messages/get-all-receivers`,
        getAuthHeaders(token)
    );
};

export const sendMessage = (token, message, senderId, receiverId) => {
    return axios.post(
        `${backendUrl}/api/messages`,
        {
            text: message,
            sender_id: senderId,
            receiver_id: receiverId,
        },
        getAuthHeaders(token)
    );
};

export const editMessage = (token, message, messageId) => {
    return axios.put(
        `${backendUrl}/api/messages/${messageId}`,
        {
            text: message,
        },
        getAuthHeaders(token)
    );
};

export const deleteMessage = (token, messageId) => {
    return axios.delete(
        `${backendUrl}/api/messages/${messageId}`,
        getAuthHeaders(token)
    );
};
