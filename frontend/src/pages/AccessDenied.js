import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldExclamationIcon, ArrowLeftIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';

const AccessDenied = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Déterminer le message selon le contexte
  const getMessage = () => {
    if (!isAuthenticated) {
      return {
        title: "Authentification requise",
        description: "Vous devez vous connecter pour accéder à cette page.",
        action: "Se connecter"
      };
    }
    
    if (location.pathname.startsWith('/admin')) {
      return {
        title: "Accès administrateur requis",
        description: "Cette page est réservée aux administrateurs autorisés.",
        action: "Accéder au dashboard"
      };
    }
    
    return {
      title: "Accès refusé",
      description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      action: "Retour au dashboard"
    };
  };

  const message = getMessage();

  const handleGoBack = () => {
    if (isAuthenticated) {
      // Rediriger vers le dashboard approprié selon le rôle
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo size="medium" showText={true} />
          </div>
          
          {/* Icon */}
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <ShieldExclamationIcon className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            {message.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {message.description}
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
          <div className="text-center space-y-6">
            {/* Error badge */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <ShieldExclamationIcon className="h-5 w-5" />
                <div>
                  <strong className="text-sm">Erreur 403 - Accès Interdit</strong>
                  {user && (
                    <p className="text-xs mt-1">
                      Rôle actuel : {user.role || 'Non défini'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* User info if authenticated */}
            {isAuthenticated && user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-3">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900">
                      Connecté en tant que : {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Email : {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleGoBack}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all duration-200"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                {isAuthenticated ? message.action : 'Retour à l\'accueil'}
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login', { state: { from: location } })}
                  className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Se connecter
                </button>
              )}

              <button
                onClick={() => navigate(-1)}
                className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Page précédente
              </button>
            </div>
          </div>
        </div>

        {/* Help section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <ShieldExclamationIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-blue-900 mb-2">
                Besoin d'aide ?
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  {isAuthenticated
                    ? "Si vous pensez avoir besoin d'accès à cette page, contactez votre administrateur système."
                    : "Cette page nécessite une authentification. Connectez-vous avec un compte autorisé pour y accéder."}
                </p>
                {isAuthenticated && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="font-medium mb-2">Contact support :</p>
                    <p className="text-xs">📧 Contact@experiencetech-tchad.com</p>
                    <p className="text-xs">📞 +235 60 29 05 10</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;