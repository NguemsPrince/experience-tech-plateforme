import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  return (
    <>
      <Helmet>
        <title>Page non trouvée - Expérience Tech</title>
        <meta name="description" content="La page que vous recherchez n'existe pas ou a été déplacée." />
      </Helmet>

      <div className={`min-h-screen flex items-center justify-center ${isAdminRoute ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-md w-full text-center px-4">
          <div className="mb-8">
            <h1 className={`text-9xl font-bold ${isAdminRoute ? 'text-purple-500' : 'text-primary-600'}`}>404</h1>
            <h2 className={`text-3xl font-bold mb-4 ${isAdminRoute ? 'text-white' : 'text-gray-900'}`}>
              Page non trouvée
            </h2>
            <p className={`text-lg mb-8 ${isAdminRoute ? 'text-gray-300' : 'text-gray-600'}`}>
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            {location.pathname && (
              <p className={`text-sm mb-4 ${isAdminRoute ? 'text-gray-400' : 'text-gray-500'}`}>
                Route tentée : <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{location.pathname}</code>
              </p>
            )}
          </div>

          <div className="space-y-4">
            {isAdminRoute ? (
              <Link
                to="/admin"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Retour au dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/"
                  className="btn-primary inline-flex items-center"
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Retour à l'accueil
                </Link>
                
                <div>
                  <button
                    onClick={() => window.history.back()}
                    className="btn-secondary inline-flex items-center"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Page précédente
                  </button>
                </div>
              </>
            )}
          </div>

          {!isAdminRoute && (
            <div className="mt-12">
              <h3 className={`text-lg font-semibold mb-4 ${isAdminRoute ? 'text-white' : 'text-gray-900'}`}>
                Pages populaires
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Link
                  to="/services"
                  className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Nos services
                </Link>
                <Link
                  to="/training"
                  className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Formations
                </Link>
                <Link
                  to="/products"
                  className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Réalisations
                </Link>
                <Link
                  to="/contact"
                  className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotFound;
