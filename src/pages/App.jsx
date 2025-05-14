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
import ProductForm from './ProductForm';
import RestaurantProducts from './RestaurantProducts';
import Map from './Map';
import BillDetails from '../components/BillDetails';
import { CartProvider } from '../context/CartContext';

/* ─── Pantalla de carga ─── */
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600" />
  </div>
);

/* ─── Rutas protegidas ─── */
function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'admin')
    return <Navigate to="/no-permiso" replace />;
  return children;
}

/* ─── Rutas principales ─── */
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (solo si NO estás autenticado) */}
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

        {/* Admin */}
        {/* <Route
          path="/inventory"
          element={
            <ProtectedRoute requireAdmin>
              <Inventory />
            </ProtectedRoute>
          }
        /> */}

        {/* Página principal */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
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

        {/* Productos de un restaurante */}
        <Route
          path="/restaurants/:id"
          element={
            <ProtectedRoute>
              <RestaurantProducts />
            </ProtectedRoute>
          }
        />

        {/* Mapa */}
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />

        {/* Inventario: formulario de producto sin protección */}
        <Route path="/productform" element={<ProductForm />} />

        {/* NUEVO — Detalle de factura */}
        <Route
          path="/bills/:id"
          element={
            <ProtectedRoute>
              <BillDetails />
            </ProtectedRoute>
          }
        />

        {/* Wildcard → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

