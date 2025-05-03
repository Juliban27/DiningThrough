// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Add a safe check before parsing JSON
        const storedUserStr = localStorage.getItem('myAppUser');
        const storedToken = localStorage.getItem('myAppToken');
        
        if (storedUserStr && storedToken) {
            try {
                const storedUser = JSON.parse(storedUserStr);
                setUser(storedUser);
                setToken(storedToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } catch (error) {
                // If there's an issue parsing the JSON, clear the invalid storage
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('myAppUser');
                localStorage.removeItem('myAppToken');
            }
        }
    }, []);

    const login = ({ token, user }) => {
        console.log('AuthProvider.login 👉', { token, user });
        
        // Ensure we have valid data before storing
        if (!token || !user) {
            console.error('Invalid login data', { token, user });
            return;
        }
        
        localStorage.setItem('myAppToken', token);
        localStorage.setItem('myAppUser', JSON.stringify(user));
        setToken(token);
        setUser(user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem('myAppToken');
        localStorage.removeItem('myAppUser');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}