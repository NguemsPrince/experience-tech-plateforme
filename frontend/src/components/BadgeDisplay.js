import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/solid';

const BadgeDisplay = ({ badges, compact = false, limit = null }) => {
  const displayedBadges = limit ? badges.slice(0, limit) : badges;
  const remainingCount = limit && badges.length > limit ? badges.length - limit : 0;

  if (compact) {
    return (
      <div className="flex items-center space-x-1">
        {displayedBadges.map((badge, index) => (
          <motion.div
            key={badge.badgeId || index}
            whileHover={{ scale: 1.2 }}
            className="relative group"
          >
            <span 
              className="text-2xl cursor-pointer"
              title={`${badge.name}: ${badge.description}`}
            >
              {badge.icon}
            </span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                <div className="font-semibold">{badge.name}</div>
                <div className="text-gray-300">{badge.description}</div>
              </div>
            </div>
          </motion.div>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs text-gray-500 font-medium">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.badgeId || index}
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative bg-white rounded-lg shadow-md p-4 border-2 hover:shadow-lg transition-all"
          style={{ borderColor: badge.color || '#3B82F6' }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl mb-2">{badge.icon}</div>
            <h4 className="font-semibold text-gray-900 mb-1">{badge.name}</h4>
            <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
            {badge.earnedAt && (
              <p className="text-xs text-gray-400">
                Obtenu le {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
          <div 
            className="absolute top-2 right-2"
            style={{ color: badge.color || '#3B82F6' }}
          >
            <SparklesIcon className="w-4 h-4" />
          </div>
        </motion.div>
      ))}
      
      {badges.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          <SparklesIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Aucun badge obtenu pour le moment</p>
          <p className="text-sm mt-1">Participez activement pour débloquer des badges !</p>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;


