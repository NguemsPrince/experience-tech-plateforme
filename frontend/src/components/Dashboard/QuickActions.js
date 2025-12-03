import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  UserGroupIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const QuickActions = ({ darkMode, onActionClick }) => {
  const navigate = useNavigate();
  const actions = [
    {
      id: 'add-user',
      title: 'Ajouter un utilisateur',
      description: 'Créer un nouveau compte utilisateur',
      icon: UserGroupIcon,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      href: '/admin/users/new'
    },
    {
      id: 'create-project',
      title: 'Nouveau projet',
      description: 'Démarrer un nouveau projet',
      icon: DocumentTextIcon,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      href: '/admin/projects/new'
    },
    {
      id: 'add-training',
      title: 'Nouvelle formation',
      description: 'Créer une nouvelle formation',
      icon: AcademicCapIcon,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      href: '/admin/training/new'
    },
    {
      id: 'generate-report',
      title: 'Générer un rapport',
      description: 'Créer un rapport de performance',
      icon: ChartBarIcon,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      href: '/admin/reports'
    },
    {
      id: 'system-settings',
      title: 'Paramètres système',
      description: 'Configurer les paramètres',
      icon: CogIcon,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20',
      href: '/admin/settings'
    },
    {
      id: 'send-notification',
      title: 'Envoyer notification',
      description: 'Notifier tous les utilisateurs',
      icon: BellIcon,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      href: '/admin/notifications'
    }
  ];

  const handleActionClick = (action) => {
    // Navigation directe vers les pages
    switch (action.id) {
      case 'add-user':
        navigate('/admin/users/new');
        break;
      case 'create-project':
        navigate('/admin/projects/new');
        break;
      case 'add-training':
        navigate('/admin/training/new');
        break;
      case 'generate-report':
        navigate('/admin/reports');
        break;
      case 'system-settings':
        navigate('/admin/settings');
        break;
      case 'send-notification':
        navigate('/admin/notifications/send');
        break;
      default:
        // Fallback vers l'ancien système
        if (onActionClick) {
          onActionClick(action.id);
        }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700`}
    >
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Actions rapides
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Accès rapide aux fonctions principales
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Disponible
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`${action.bgColor} rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group relative`}
                onClick={() => handleActionClick(action)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRightIcon className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200`} />
                </div>
                
                <div>
                  <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200`}>
                    {action.title}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {action.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Actions */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Actions avancées
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Fonctions administratives avancées
              </p>
            </div>
            <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
              Voir plus
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;
