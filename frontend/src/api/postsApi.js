// src/api/postsApi.js

import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Create a new post
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

// Get posts by user ID
export const getPostsByUser = (token, userId) => {
    return axios.get(`${backendUrl}/api/posts/get-by-user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
};

// Show a specific post
export const getPost = (token, postId) => {
    return axios.get(`${backendUrl}/api/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
};

// Update a post
export const updatePost = (token, postId, { text }) => {
    return axios.put(
        `${backendUrl}/api/posts/${postId}`,
        { text },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );
};

// Delete a post
export const deletePost = (token, postId) => {
    return axios.delete(`${backendUrl}/api/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
};
