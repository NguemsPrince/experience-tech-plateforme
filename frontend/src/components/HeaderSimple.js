import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../config/images';

const HeaderSimple = () => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        width: '100%'
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center"
            >
              <img 
                src={IMAGES.logo} 
                alt="Expérience Tech" 
                className="h-10 w-auto mr-2"
              />
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Expérience Tech</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/training" className="text-gray-700 hover:text-blue-600 transition-colors">
              Formation
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Produits
            </Link>
            <Link to="/news" className="text-gray-700 hover:text-blue-600 transition-colors">
              Actualités
            </Link>
            <Link to="/testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
              Témoignages
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              À propos
            </Link>
          </div>

          {/* Actions droite */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderSimple;
