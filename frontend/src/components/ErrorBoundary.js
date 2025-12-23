import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ErrorBoundary = ({ error, onRetry, onDismiss, maxRetries = 3 }) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await onRetry();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorType = () => {
    if (error?.code === 'NETWORK_ERROR') return 'network';
    if (error?.code === 'TIMEOUT') return 'timeout';
    if (error?.code === 'SERVER_ERROR') return 'server';
    return 'generic';
  };

  const getErrorConfig = () => {
    const type = getErrorType();
    const configs = {
      network: {
        icon: ExclamationTriangleIcon,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        title: 'Problème de connexion',
        message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        canRetry: true
      },
      timeout: {
        icon: ExclamationTriangleIcon,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        title: 'Délai d\'attente dépassé',
        message: 'La requête a pris trop de temps. Le serveur semble lent.',
        canRetry: true
      },
      server: {
        icon: ExclamationTriangleIcon,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        title: 'Erreur serveur',
        message: 'Le serveur a rencontré une erreur. Veuillez réessayer plus tard.',
        canRetry: true
      },
      generic: {
        icon: InformationCircleIcon,
        color: 'text-gray-500',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        title: 'Une erreur est survenue',
        message: error?.message || 'Une erreur inattendue s\'est produite.',
        canRetry: true
      }
    };
    return configs[type];
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${config.bgColor} rounded-lg p-6 max-w-md w-full mx-4 shadow-xl`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon className={`w-6 h-6 ${config.color} mr-3`} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {config.title}
            </h3>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {config.message}
        </p>
        
        {retryCount >= maxRetries && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-md">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Nombre maximum de tentatives atteint. Veuillez contacter le support.
            </p>
          </div>
        )}
        
        <div className="flex space-x-3">
          {config.canRetry && retryCount < maxRetries && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isRetrying ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                  Réessai...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Réessayer
                </>
              )}
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Actualiser la page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;