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
import BillDetails from '../components/BillDetails';
import MapView from "../pages/MapView";
import RestaurantRegister from './RestaurantRegister'; 
import { CartProvider } from '../context/CartContext';

import { OrderDetailsWrapper } from '../components/OrderDetailsWrapper'; 

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
      <CartProvider>
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

          {/* NUEVA RUTA: Detalle de orden */}
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute requireAdmin>
                <OrderDetailsWrapper />
              </ProtectedRoute>
            }
          />


          {/* Mapa */}
          <Route
            path="/productform"
            element={
              <ProtectedRoute requireAdmin>
                <ProductForm />
              </ProtectedRoute>
            }
          />

          {/* NUEVO — Detalle de factura */}
          <Route
            path="/bills/:id"
            element={
              <ProtectedRoute>
                <BillDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mapsview"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mapsview/:restaurantId?"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />

          {/* Crear nuevo restaurante */}
          <Route
            path="/RestaurantRegister"
            element={
              <ProtectedRoute requireAdmin>
                <RestaurantRegister />
              </ProtectedRoute>
            }
          />

          {/* Wildcard → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
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


