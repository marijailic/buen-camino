// src/api/postsApi.js

import axios from "axios";
import { getAuthHeaders } from "./apiUtils";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getPostsByUser = (token, userId) => {
    return axios.get(
        `${backendUrl}/api/posts/get-by-user/${userId}`,
        getAuthHeaders(token)
    );
};

export const createPost = (token, { text, image, userId }) => {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("user_id", userId);
    if (image) {
        formData.append("image", image);
    }

    return axios.post(`${backendUrl}/api/posts`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getPost = (token, postId) => {
    return axios.get(
        `${backendUrl}/api/posts/${postId}`,
        getAuthHeaders(token)
    );
};

export const updatePost = (token, postId, { text }) => {
    return axios.put(
        `${backendUrl}/api/posts/${postId}`,
        { text },
        getAuthHeaders(token)
    );
};

export const deletePost = (token, postId) => {
    return axios.delete(
        `${backendUrl}/api/posts/${postId}`,
        getAuthHeaders(token)
    );
};
