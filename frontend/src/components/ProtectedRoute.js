import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = null, fallbackPath = null }) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Vérifier si la route est une route admin (basé sur le chemin ou le rôle requis)
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
  const requiresAdmin = isAdminRoute || requiredRole === 'admin';

  // SÉCURITÉ CRITIQUE : Vérifier IMMÉDIATEMENT le token dans localStorage
  // Cette vérification doit être faite AVANT tout, même pendant isLoading
  // Pour bloquer l'accès dès le premier rendu si pas de token
  const tokenInStorage = localStorage.getItem('token');
  const hasValidToken = tokenInStorage && 
    tokenInStorage !== 'null' && 
    tokenInStorage !== 'undefined' && 
    tokenInStorage.trim() !== '';

  // SÉCURITÉ CRITIQUE : Si pas de token valide, rediriger IMMÉDIATEMENT (même pendant isLoading)
  // Ne jamais attendre la fin du chargement pour bloquer l'accès sans token
  if (!hasValidToken) {
    if (requiresAdmin) {
      console.warn('🚫 [ProtectedRoute] Pas de token dans localStorage, redirection IMMÉDIATE vers /admin/login', {
        path: location.pathname,
        requiredRole,
        isLoading
      });
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    console.warn('🚫 [ProtectedRoute] Pas de token dans localStorage, redirection IMMÉDIATE vers /login', {
      path: location.pathname,
      isLoading
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // SÉCURITÉ CRITIQUE : Bloquer l'accès pendant la vérification
  // Ne jamais afficher le contenu pendant la vérification
  // C'est la DEUXIÈME vérification à faire (après la vérification du token)
  if (isLoading) {
    console.log('🔒 [ProtectedRoute] En attente de vérification d\'authentification...', {
      path: location.pathname,
      requiredRole,
      hasToken: hasValidToken
    });
    return <LoadingSpinner size="large" text="Vérification de l'authentification..." />;
  }

  // SÉCURITÉ CRITIQUE : Pour les routes admin ou nécessitant le rôle admin
  // Les routes admin nécessitent TOUJOURS une authentification et le rôle admin
  // Cette vérification doit être faite AVANT toute autre vérification
  if (requiresAdmin) {
    // 1. Vérifier si l'utilisateur est authentifié
    // Si pas authentifié, rediriger IMMÉDIATEMENT sans afficher le contenu
    if (!isAuthenticated) {
      console.warn('🚫 BLOCAGE: Tentative d\'accès admin sans authentification:', {
        path: location.pathname,
        isAuthenticated,
        isLoading,
        hasToken: !!localStorage.getItem('token'),
        requiredRole
      });
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // 2. Vérifier si l'utilisateur existe
    if (!user) {
      console.error('🚫 BLOCAGE: Utilisateur non trouvé malgré l\'authentification:', {
        path: location.pathname,
        isAuthenticated,
        requiredRole
      });
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // 3. Vérifier si l'utilisateur a le rôle admin, super_admin ou moderator
    // SÉCURITÉ CRITIQUE : Bloquer explicitement les rôles client, student et tout autre rôle
    // Si pas admin/moderator/super_admin, rediriger IMMÉDIATEMENT vers la page d'accueil
    const allowedAdminRoles = ['admin', 'super_admin', 'moderator'];
    if (!allowedAdminRoles.includes(user.role)) {
      console.error('🚫 BLOCAGE: Tentative d\'accès admin par un non-admin:', {
        user: user?.email || 'unknown',
        role: user?.role || 'none',
        path: location.pathname,
        isAuthenticated,
        requiredRole,
        allowedRoles: allowedAdminRoles
      });
      // Rediriger vers la page d'accueil si l'utilisateur n'a pas le rôle admin
      return <Navigate to="/" replace />;
    }

    // Pour les routes admin, si toutes les vérifications passent, autoriser l'accès
    console.log('✅ [ProtectedRoute] Accès autorisé pour route admin:', {
      path: location.pathname,
      user: user?.email,
      role: user?.role
    });
    return children;
  }

  // Pour les routes protégées non-admin, vérifier l'authentification
  if (!isAuthenticated) {
    console.warn('🚫 [ProtectedRoute] Utilisateur non authentifié, redirection vers /login', {
      path: location.pathname
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérification stricte du rôle requis (pour les routes non-admin avec rôle requis)
  if (requiredRole && requiredRole !== 'admin' && user) {
    if (user.role !== requiredRole) {
      console.warn('🚫 [ProtectedRoute] Rôle insuffisant:', {
        path: location.pathname,
        requiredRole,
        userRole: user.role
      });
      // User doesn't have required role - redirect to access denied or fallback
      if (fallbackPath) {
        return <Navigate to={fallbackPath} replace />;
      }
      return <Navigate to="/access-denied" replace />;
    }
  }

  // Tout est OK, afficher le contenu
  console.log('✅ [ProtectedRoute] Accès autorisé:', {
    path: location.pathname,
    user: user?.email,
    role: user?.role
  });
  return children;
};

export default ProtectedRoute;
