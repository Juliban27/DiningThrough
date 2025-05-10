import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Se ejecuta al iniciar la aplicación para cargar datos del localStorage
    useEffect(() => {
        const initAuth = () => {
            const storedUserStr = localStorage.getItem('myAppUser');
            const storedToken = localStorage.getItem('myAppToken');
            
            if (storedUserStr && storedToken) {
                try {
                    const storedUser = JSON.parse(storedUserStr);
                    setUser(storedUser);
                    setToken(storedToken);
                    
                    // Configurar el token en axios para todas las solicitudes futuras
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    
                    console.log('🔑 Sesión restaurada:', { user: storedUser });
                } catch (error) {
                    console.error('Error al parsear datos de usuario:', error);
                    localStorage.removeItem('myAppUser');
                    localStorage.removeItem('myAppToken');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = ({ token, user }) => {
        console.log('🔐 Login exitoso:', { token, user });
        
        if (!token || !user) {
            console.error('Datos de login inválidos', { token, user });
            return;
        }
        
        // Guardar en localStorage
        localStorage.setItem('myAppToken', token);
        localStorage.setItem('myAppUser', JSON.stringify(user));
        
        // Actualizar estado
        setToken(token);
        setUser(user);
        
        // Configurar axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        console.log('🚪 Cerrando sesión');
        localStorage.removeItem('myAppToken');
        localStorage.removeItem('myAppUser');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    // Verificar si el token sigue siendo válido
    const isAuthenticated = () => {
        return !!user && !!token;
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            isAuthenticated,
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
}