import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'increase',
  color = 'blue',
  prefix = '',
  suffix = '',
  decimals = 0
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {prefix}
              <CountUp 
                end={typeof value === 'number' ? value : parseInt(value)} 
                duration={2}
                decimals={decimals}
                separator=" "
              />
              {suffix}
            </h3>
          </div>
          
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {changeType === 'increase' ? '↑' : '↓'} {change}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs mois dernier
              </span>
            </div>
          )}
        </div>
        
        <div className={`${colorClasses[color]} p-4 rounded-xl`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;

