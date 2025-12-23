import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';

const RatingSystem = ({ 
  courseId, 
  currentRating = 0, 
  onRate, 
  showLabel = true, 
  size = 'md',
  interactive = true 
}) => {
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userRating, setUserRating] = useState(currentRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUserRating(currentRating);
  }, [currentRating]);

  const handleRatingClick = async (rating) => {
    if (!interactive || !user) {
      if (!user) {
        alert('Veuillez vous connecter pour noter cette formation');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (onRate) {
        await onRate(courseId, rating);
      }
      setUserRating(rating);
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
      alert('Erreur lors de la notation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouseEnter = (rating) => {
    if (interactive) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0);
    }
  };

  const getStarSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      case 'xl': return 'w-10 h-10';
      default: return 'w-6 h-6';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      default: return 'text-sm';
    }
  };

  const displayRating = hoveredRating || userRating;

  return (
    <div className="flex items-center space-x-2">
      {/* Étoiles */}
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          const isHovered = star <= hoveredRating;
          
          return (
            <motion.button
              key={star}
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive || isSubmitting}
              className={`${getStarSize()} transition-colors duration-200 ${
                interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
              } ${isSubmitting ? 'opacity-50' : ''}`}
              whileHover={interactive ? { scale: 1.1 } : {}}
              whileTap={interactive ? { scale: 0.95 } : {}}
            >
              {isFilled ? (
                <StarSolidIcon 
                  className={`${getStarSize()} ${
                    isHovered ? 'text-yellow-400' : 'text-yellow-500'
                  }`} 
                />
              ) : (
                <StarIcon 
                  className={`${getStarSize()} ${
                    interactive ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-300'
                  }`} 
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Label et note */}
      {showLabel && (
        <div className="flex items-center space-x-2">
          <span className={`${getTextSize()} font-medium text-gray-900`}>
            {userRating > 0 ? userRating.toFixed(1) : '0.0'}
          </span>
          {interactive && user && (
            <span className={`${getTextSize()} text-gray-600`}>
              {userRating > 0 ? '(Votre note)' : '(Cliquez pour noter)'}
            </span>
          )}
        </div>
      )}

      {/* Indicateur de chargement */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-1"
        >
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-xs text-gray-600">Enregistrement...</span>
        </motion.div>
      )}
    </div>
  );
};

export default RatingSystem;
