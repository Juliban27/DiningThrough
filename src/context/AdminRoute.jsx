// src/context/AdminRoute.jsx
import React from 'react';
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // no logueado → login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user.role !== 'admin') {
    // logueado pero no admin → no-permiso
    return <Navigate to="/no-permiso" replace />;
  }
  // todo OK
  return children;
}
