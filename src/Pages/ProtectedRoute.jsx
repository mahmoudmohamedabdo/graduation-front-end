// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('username'); 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
