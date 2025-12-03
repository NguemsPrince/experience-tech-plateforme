import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CogIcon,
  XMarkIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const ModernSidebar = ({ 
  isOpen, 
  onClose, 
  items, 
  activeView, 
  onViewChange, 
  darkMode,
  user = null
}) => {
  // Get user initials
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'A';
  };

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Admin';
  };

  const getUserRole = () => {
    if (user?.role === 'super_admin') {
      return 'Super Administrateur';
    }
    if (user?.role === 'admin') {
      return 'Administrateur';
    }
    return 'Utilisateur';
  };
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-full w-80 z-50 transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
            : 'bg-gradient-to-b from-purple-600 to-blue-600'
        } shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ET</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Expérience Tech</h2>
                  <p className="text-white/70 text-sm">Administration</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{getUserName()}</p>
                <p className="text-white/70 text-sm truncate">{getUserRole()}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {items.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => onViewChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/20 text-white shadow-lg' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Performance</p>
                  <p className="text-white/70 text-xs">+12% ce mois</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Desktop Sidebar (Collapsed) */}
      <motion.aside
        className={`hidden lg:block fixed left-0 top-0 h-full w-20 z-30 transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
            : 'bg-gradient-to-b from-purple-600 to-blue-600'
        } shadow-xl`}
      >
        <div className="flex flex-col h-full items-center py-6">
          {/* Logo */}
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-8">
            <span className="text-white font-bold text-lg">ET</span>
          </div>

          {/* Navigation Icons */}
          <nav className="flex-1 space-y-4">
            {items.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onViewChange(item.id)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  title={item.name}
                >
                  <Icon className="w-6 h-6" />
                </motion.button>
              );
            })}
          </nav>

          {/* User Avatar */}
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{getUserInitials()[0]}</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default ModernSidebar;
