// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROLES } from '../constants/roles';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is trying to access admin routes without admin role
  if (location.pathname.startsWith('/admin-dashboard') && userRole !== ROLES.ADMIN) {
    // Redirect based on user role
    if (userRole === ROLES.EMPLOYER || userRole === ROLES.COMPANY) {
      return <Navigate to="/companydashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Check if user is trying to access company routes without company role
  if (location.pathname.startsWith('/companydashboard') && userRole !== ROLES.EMPLOYER && userRole !== ROLES.COMPANY) {
    if (userRole === ROLES.ADMIN) {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Check if user is trying to access regular user routes with admin/company role
  if ((location.pathname === '/home' || location.pathname.startsWith('/level') || location.pathname.startsWith('/jops')) && 
      (userRole === ROLES.ADMIN || userRole === ROLES.EMPLOYER || userRole === ROLES.COMPANY)) {
    if (userRole === ROLES.ADMIN) {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/companydashboard" replace />;
    }
  }

  return children;
}
