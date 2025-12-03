import React from 'react';
import { 
  UsersIcon,
  CurrencyDollarIcon,
  CubeIcon,
  AcademicCapIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const AdminStatsCards = ({ stats, darkMode = false }) => {
  // Provide default values if stats is undefined or null
  const defaultStats = {
    totalUsers: 0,
    userGrowth: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalProjects: 0,
    projectGrowth: 0,
    totalTrainings: 0,
    trainingGrowth: 0
  };

  const safeStats = stats || defaultStats;

  const statsData = [
    {
      title: 'Utilisateurs totaux',
      value: safeStats.totalUsers,
      change: `+${safeStats.userGrowth}%`,
      changeType: 'positive',
      icon: UsersIcon,
      color: 'blue',
      trend: [1200, 1180, 1150, 1200, safeStats.totalUsers],
      description: 'Croissance constante'
    },
    {
      title: 'Revenus totaux',
      value: `${(safeStats.totalRevenue / 1000000).toFixed(1)}M FCFA`,
      change: `+${safeStats.monthlyGrowth}%`,
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      color: 'green',
      trend: [35, 38, 42, 40, safeStats.totalRevenue / 1000000],
      description: 'Revenus mensuels'
    },
    {
      title: 'Projets actifs',
      value: safeStats.totalProjects,
      change: `+${safeStats.projectGrowth}%`,
      changeType: 'positive',
      icon: CubeIcon,
      color: 'orange',
      trend: [140, 145, 150, 152, safeStats.totalProjects],
      description: 'Projets en cours'
    },
    {
      title: 'Formations',
      value: safeStats.totalTrainings,
      change: `+${safeStats.trainingGrowth}`,
      changeType: 'positive',
      icon: AcademicCapIcon,
      color: 'purple',
      trend: [8, 9, 10, 11, safeStats.totalTrainings],
      description: 'Nouveaux cours'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        icon: 'text-blue-600 dark:text-blue-400',
        accent: 'bg-blue-100 dark:bg-blue-800',
        border: 'border-blue-200 dark:border-blue-700'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        icon: 'text-green-600 dark:text-green-400',
        accent: 'bg-green-100 dark:bg-green-800',
        border: 'border-green-200 dark:border-green-700'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        icon: 'text-orange-600 dark:text-orange-400',
        accent: 'bg-orange-100 dark:bg-orange-800',
        border: 'border-orange-200 dark:border-orange-700'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        icon: 'text-purple-600 dark:text-purple-400',
        accent: 'bg-purple-100 dark:bg-purple-800',
        border: 'border-purple-200 dark:border-purple-700'
      }
    };
    return colors[color] || colors.blue;
  };

  const MiniChart = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 100 : 50;
          return (
            <div
              key={index}
              className={`w-1 rounded-t ${
                color === 'blue' ? 'bg-blue-400' :
                color === 'green' ? 'bg-green-400' :
                color === 'orange' ? 'bg-orange-400' :
                'bg-purple-400'
              }`}
              style={{ height: `${Math.max(height, 20)}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        return (
          <div
            key={index}
            className={`${colors.bg} ${colors.border} border rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colors.accent}`}>
                <stat.icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div className="flex items-center space-x-1">
                {stat.changeType === 'positive' ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <MiniChart data={stat.trend} color={stat.color} />
              </div>
              <div className="ml-3">
                <ArrowTrendingUpIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;
