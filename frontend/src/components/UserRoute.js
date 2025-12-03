import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { hasAccess, isAdmin, requiresAuth } from '../utils/permissions';

const UserRoute = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner size="large" text="Vérification de l'authentification..." />;
  }

  const currentPath = location.pathname;
  const userRole = user?.role;

  // Si l'utilisateur est admin, il peut accéder à toutes les pages
  if (isAdmin(userRole)) {
    return children;
  }

  // Vérifier si la page nécessite une authentification
  if (requiresAuth(currentPath) && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier si l'utilisateur a accès à cette page
  if (!hasAccess(userRole, currentPath)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default UserRoute;
