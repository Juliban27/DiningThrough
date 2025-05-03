import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NoPermiso = () => {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Acceso denegado</h1>
        
        <p className="text-gray-600 mb-6">
          No tienes los permisos necesarios para acceder a esta página. 
          {user && (
            <span> Has iniciado sesión como <b>{user.name}</b> con rol <b>{user.role}</b>.</span>
          )}
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link
            to="/index"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Ir a la página principal
          </Link>
          
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoPermiso;