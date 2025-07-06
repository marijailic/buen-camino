// src/utils/validation.js

export const validateRegister = ({ firstName, lastName, email, password }) => {
    const errors = {};

    if (!firstName) {
        errors.firstName = "First name is required.";
    } else if (firstName.length > 255) {
        errors.firstName = "First name must be max 255 characters.";
    }

    if (!lastName) {
        errors.lastName = "Last name is required.";
    } else if (lastName.length > 255) {
        errors.lastName = "Last name must be max 255 characters.";
    }

    if (!email) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Email format is invalid.";
    } else if (email.length > 255) {
        errors.email = "Email must be max 255 characters.";
    }

    if (!password) {
        errors.password = "Password is required.";
    } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    } else if (password.length > 255) {
        errors.password = "Password must be max 255 characters.";
    }

    return errors;
};

export const validateLogin = ({ email, password }) => {
    const errors = {};

    if (!email.trim()) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Invalid email format.";
    }

    if (!password.trim()) {
        errors.password = "Password is required.";
    } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    }

    return errors;
};
