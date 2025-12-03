import React from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

function ModernStatsCards({ darkMode, stats }) {
  // Utiliser les données passées en props ou des valeurs par défaut
  const defaultStats = {
    revenue: { total: 0 },
    users: { total: 0, new: 0 },
    orders: { total: 0, pending: 0 },
    products: { total: 0, active: 0 },
    courses: { total: 0, active: 0 },
    support: { openTickets: 0 },
  };

  const safeStats = stats || defaultStats;
  
  // Calculer les pourcentages de croissance (simulation pour l'instant)
  const revenueGrowth = safeStats.revenue?.total > 0 ? 8 : 0;
  const userGrowth = safeStats.users?.new > 0 ? 12 : 0;
  const orderGrowth = safeStats.orders?.pending > 0 ? 5 : 0;
  const productGrowth = safeStats.products?.active > 0 ? 3 : 0;

  const statsData = [
    {
      title: 'REVENUS TOTAUX',
      value: `${(safeStats.revenue?.total || 0).toLocaleString('fr-FR')} XAF`,
      subtitle: `Revenus générés`,
      icon: CurrencyDollarIcon,
      trend: `+${revenueGrowth}%`,
      trendDirection: 'up',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
    },
    {
      title: 'UTILISATEURS',
      value: (safeStats.users?.total || 0).toString(),
      subtitle: `${safeStats.users?.new || 0} nouveaux ce mois`,
      icon: UsersIcon,
      trend: `+${userGrowth}%`,
      trendDirection: 'up',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
    },
    {
      title: 'COMMANDES',
      value: (safeStats.orders?.total || 0).toString(),
      subtitle: `${safeStats.orders?.pending || 0} en attente`,
      icon: DocumentTextIcon,
      trend: `+${orderGrowth}%`,
      trendDirection: 'up',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
      title: 'PRODUITS',
      value: (safeStats.products?.active || 0).toString(),
      subtitle: `${safeStats.products?.total || 0} au total`,
      icon: ChartBarIcon,
      trend: `+${productGrowth}%`,
      trendDirection: 'up',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendDirection === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                stat.trendDirection === 'up' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                <TrendIcon className="w-3 h-3" />
                <span>{stat.trend}</span>
              </div>
            </div>
            
            <div>
              <h3 className={`text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.title}
              </h3>
              <p className={`text-2xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {stat.subtitle}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className={`w-full h-2 rounded-full ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.abs(parseInt(stat.trend)))}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Export par défaut
export default ModernStatsCards;

// Export nommé pour compatibilité
export { ModernStatsCards };
