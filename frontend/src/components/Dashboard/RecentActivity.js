import React from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const RecentActivity = ({ darkMode, activities }) => {
  // Utiliser les données passées en props ou des données par défaut
  const defaultActivities = [
    {
      id: 1,
      type: 'user',
      title: 'Nouvel utilisateur inscrit',
      description: 'Marie Kouassi s\'est inscrite sur la plateforme',
      time: 'Il y a 5 minutes',
      icon: UserIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 2,
      type: 'project',
      title: 'Projet terminé',
      description: 'Site web e-commerce pour ABC Company',
      time: 'Il y a 1 heure',
      icon: CheckCircleIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 3,
      type: 'training',
      title: 'Nouvelle formation ajoutée',
      description: 'Formation React.js avancé',
      time: 'Il y a 2 heures',
      icon: AcademicCapIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Paiement en attente',
      description: 'Facture #1234 en attente de paiement',
      time: 'Il y a 3 heures',
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      id: 5,
      type: 'info',
      title: 'Mise à jour système',
      description: 'Mise à jour de sécurité appliquée',
      time: 'Il y a 4 heures',
      icon: InformationCircleIcon,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30'
    }
  ];

  const safeActivities = activities || defaultActivities;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700`}
    >
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Activité récente
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Dernières actions sur la plateforme
            </p>
          </div>
          <button className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            Voir tout
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {safeActivities.map((activity, index) => {
            const Icon = activity.icon;
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group cursor-pointer"
              >
                {/* Icon */}
                <div className={`p-2 rounded-lg ${activity.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200`}>
                      {activity.title}
                    </h4>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} flex items-center space-x-1`}>
                      <ClockIcon className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {activity.description}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            Charger plus d'activités
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivity;
