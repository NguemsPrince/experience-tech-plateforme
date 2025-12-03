import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

/**
 * Carte de statistique avec icône et tendance
 */
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  loading = false,
  onClick,
  className = ''
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      light: 'bg-blue-50',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-500',
      light: 'bg-green-50',
      text: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-500',
      light: 'bg-purple-50',
      text: 'text-purple-600'
    },
    orange: {
      bg: 'bg-orange-500',
      light: 'bg-orange-50',
      text: 'text-orange-600'
    },
    red: {
      bg: 'bg-red-500',
      light: 'bg-red-50',
      text: 'text-red-600'
    },
    indigo: {
      bg: 'bg-indigo-500',
      light: 'bg-indigo-50',
      text: 'text-indigo-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const isPositiveChange = change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } : {}}
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 p-6
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {loading ? (
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          {/* Header avec icône */}
          <div className="flex items-center justify-between mb-4">
            <div className={`${colors.light} p-3 rounded-lg`}>
              {Icon && <Icon className={`h-6 w-6 ${colors.text}`} />}
            </div>
            
            {/* Badge de tendance */}
            {change !== undefined && change !== null && (
              <div className={`
                flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                ${isPositiveChange 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
                }
              `}>
                {isPositiveChange ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>

          {/* Titre */}
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            {title}
          </h3>

          {/* Valeur */}
          <p className="text-2xl font-bold text-gray-900">
            {value}
          </p>

          {/* Description du changement */}
          {change !== undefined && change !== null && (
            <p className="text-xs text-gray-500 mt-2">
              {isPositiveChange ? '+' : ''}{change}% par rapport au mois dernier
            </p>
          )}
        </>
      )}
    </motion.div>
  );
};

export default StatCard;

