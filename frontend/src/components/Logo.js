import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../config/images';

const Logo = ({ 
  size = 'default', 
  showText = true, 
  showTagline = false, 
  className = '',
  linkTo = '/',
  onClick
}) => {
  const sizeClasses = {
    small: {
      icon: 'w-12 h-12',
      text: 'text-lg',
      tagline: 'text-xs'
    },
    default: {
      icon: 'w-16 h-16',
      text: 'text-xl',
      tagline: 'text-sm'
    },
    large: {
      icon: 'w-20 h-20',
      text: 'text-2xl',
      tagline: 'text-base'
    },
    xlarge: {
      icon: 'w-24 h-24',
      text: 'text-3xl',
      tagline: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.default;

  const LogoContent = () => (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {/* Logo Image */}
      <div className={`${currentSize.icon} flex items-center justify-center`}>
        <img 
          src={IMAGES.logo} 
          alt="Expérience Tech Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback vers le SVG en cas d'erreur de chargement
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Company Name */}
      {showText && (
        <div className="flex flex-col items-center text-center">
          <span className={`${currentSize.text} font-bold text-gray-900`}>
            Expérience Tech
          </span>
          {showTagline && (
            <span className={`${currentSize.tagline} text-red-700 font-medium`}>
              Inspirer - Oser - Innover
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
        <LogoContent />
      </button>
    );
  }

  if (linkTo) {
    return (
      <Link to={linkTo} className="hover:opacity-80 transition-opacity duration-200">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default Logo;
