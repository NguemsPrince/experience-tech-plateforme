import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

/**
 * Composant Breadcrumb pour la navigation
 */
const Breadcrumb = ({ items = [], darkMode = false }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4" aria-label="Breadcrumb">
      <Link
        to="/"
        className={`flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
      >
        <HomeIcon className="w-4 h-4" />
        <span className="sr-only">Accueil</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRightIcon className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          {index === items.length - 1 ? (
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
