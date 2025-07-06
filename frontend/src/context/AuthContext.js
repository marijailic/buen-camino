// src/context/AuthContext.js

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [authUserId, setAuthUserId] = useState(
        localStorage.getItem("authUserId") || null
    );
    const [firstName, setFirstName] = useState(
        localStorage.getItem("firstName") || null
    );
    const [lastName, setLastName] = useState(
        localStorage.getItem("lastName") || null
    );

    const authLogin = (newToken, newAuthUserId, newFirstName, newLastName) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("authUserId", newAuthUserId);
        localStorage.setItem("firstName", newFirstName);
        localStorage.setItem("lastName", newLastName);

        setToken(newToken);
        setAuthUserId(newAuthUserId);
        setFirstName(newFirstName);
        setLastName(newLastName);
    };

    const authLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("authUserId");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");

        setToken(null);
        setAuthUserId(null);
        setFirstName(null);
        setLastName(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                authUserId,
                firstName,
                lastName,
                authLogin,
                authLogout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
