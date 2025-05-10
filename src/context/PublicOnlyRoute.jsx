import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para proteger rutas públicas (login/signup)
 * Redirige a los usuarios ya autenticados a su página correspondiente
 */
const PublicOnlyRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Si el usuario está autenticado, redirigir según su rol
  if (isAuthenticated()) {
    return <Navigate to={user.role === 'admin' ? '/inventory' : '/index'} replace />;
  }
  
  // Si no está autenticado, mostrar la página normalmente
  return children;
};

export default PublicOnlyRoute;