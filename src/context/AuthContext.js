import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

// Este es tu hook para consumir el contexto
export const useAuth = () => {
    return useContext(AuthContext);
};