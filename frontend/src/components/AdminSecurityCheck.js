import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

const AdminSecurityCheck = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [securityCheck, setSecurityCheck] = useState({
    isChecking: true,
    isAuthorized: false,
    error: null
  });

  useEffect(() => {
    const performSecurityCheck = async () => {
      try {
        // Vérifier l'authentification
        if (!isAuthenticated) {
          setSecurityCheck({
            isChecking: false,
            isAuthorized: false,
            error: 'Non authentifié'
          });
          navigate('/admin/login');
          return;
        }

        // Vérifier le rôle admin
        if (!user || user.role !== 'admin') {
          setSecurityCheck({
            isChecking: false,
            isAuthorized: false,
            error: 'Rôle insuffisant'
          });
          navigate('/access-denied');
          return;
        }

        // Vérifier la validité du token (optionnel)
        const token = localStorage.getItem('token');
        if (!token) {
          setSecurityCheck({
            isChecking: false,
            isAuthorized: false,
            error: 'Token manquant'
          });
          navigate('/admin/login');
          return;
        }

        // Vérification réussie
        setSecurityCheck({
          isChecking: false,
          isAuthorized: true,
          error: null
        });

      } catch (error) {
        console.error('Security check error:', error);
        setSecurityCheck({
          isChecking: false,
          isAuthorized: false,
          error: 'Erreur de vérification'
        });
        navigate('/admin/login');
      }
    };

    if (!isLoading) {
      performSecurityCheck();
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // Affichage pendant la vérification
  if (isLoading || securityCheck.isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" text="Vérification de sécurité..." />
          <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
            <ShieldCheckIcon className="h-4 w-4 mr-2" />
            Vérification des permissions administrateur
          </div>
        </div>
      </div>
    );
  }

  // Si non autorisé, ne pas afficher le contenu
  if (!securityCheck.isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Accès refusé
          </h2>
          <p className="text-gray-600">
            {securityCheck.error}
          </p>
        </div>
      </div>
    );
  }

  // Si autorisé, afficher le contenu
  return children;
};

export default AdminSecurityCheck;
