// src/api/apiUtils.js

export const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
    },
});
