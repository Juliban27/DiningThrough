import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Signup from './SignUp';
import Inventory from './Inventory';
import Index from './Index';
import NoPermiso from './NoPermiso';
import PublicOnlyRoute from '../context/PublicOnlyRoute';

// Componente de carga mientras verificamos la autenticación
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

// Protege rutas que requieren autenticación
function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated()) {
    // No autenticado -> redirigir a login
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    // No es admin pero la ruta lo requiere
    return <Navigate to="/no-permiso" replace />;
  }
  
  // Todo correcto, muestra el contenido
  return children;
}

// Componente principal que no usa contexto de autenticación
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas - Solo accesibles si NO estás autenticado */}
        <Route 
          path="/login" 
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          } 
        />
        
        <Route path="/no-permiso" element={<NoPermiso />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <Inventory />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/index" 
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;