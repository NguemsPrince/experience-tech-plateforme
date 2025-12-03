import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const NotificationPanel = ({ isOpen, onClose, darkMode, notifications }) => {
  // Utiliser les données passées en props ou des données par défaut
  const defaultNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Projet terminé avec succès',
      message: 'Le projet "Site e-commerce" a été livré dans les temps',
      time: 'Il y a 5 minutes',
      icon: CheckIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      unread: true
    },
    {
      id: 2,
      type: 'warning',
      title: 'Paiement en attente',
      message: 'Facture #1234 en attente de paiement depuis 3 jours',
      time: 'Il y a 1 heure',
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      unread: true
    },
    {
      id: 3,
      type: 'info',
      title: 'Nouvel utilisateur inscrit',
      message: 'Marie Kouassi s\'est inscrite sur la plateforme',
      time: 'Il y a 2 heures',
      icon: UserIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      unread: false
    }
  ];

  const safeNotifications = notifications || defaultNotifications;
  const unreadCount = safeNotifications.filter(n => n.unread).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-96 z-50 shadow-2xl ${
              darkMode 
                ? 'bg-gray-900 border-l border-gray-700' 
                : 'bg-white border-l border-gray-200'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <BellIcon className={`w-6 h-6 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Notifications
                      </h2>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {unreadCount} non lues
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      darkMode 
                        ? 'hover:bg-gray-800 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-4">
                  {safeNotifications.map((notification, index) => {
                    const Icon = notification.icon;
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg cursor-pointer group ${
                          notification.unread 
                            ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Icon */}
                          <div className={`p-2 rounded-lg ${notification.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                            <Icon className={`w-5 h-5 ${notification.color}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`text-sm font-semibold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h4>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              )}
                            </div>
                            <p className={`text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            } mb-2`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className={`w-3 h-3 ${
                                darkMode ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                              <span className={`text-xs ${
                                darkMode ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                {notification.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  darkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                    Marquer tout comme lu
                  </button>
                  <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}>
                    Voir toutes
                </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;