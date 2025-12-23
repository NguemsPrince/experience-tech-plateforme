import React, { useState } from 'react';
import { 
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  CubeIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
  darkMode,
  setDarkMode,
  notifications = 0 
}) => {
  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: ChartBarIcon, color: 'blue' },
    { id: 'users', name: 'Utilisateurs', icon: UsersIcon, color: 'green' },
    { id: 'content', name: 'Contenu', icon: DocumentTextIcon, color: 'purple' },
    { id: 'projects', name: 'Projets', icon: CubeIcon, color: 'orange' },
    { id: 'trainings', name: 'Formations', icon: AcademicCapIcon, color: 'indigo' },
    { id: 'support', name: 'Support', icon: ChatBubbleLeftRightIcon, color: 'blue' },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon, color: 'teal' },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon, color: 'yellow' },
    { id: 'settings', name: 'Paramètres', icon: CogIcon, color: 'gray' }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'hover:bg-blue-50 text-blue-600',
      green: isActive ? 'bg-green-100 text-green-700 border-green-200' : 'hover:bg-green-50 text-green-600',
      purple: isActive ? 'bg-purple-100 text-purple-700 border-purple-200' : 'hover:bg-purple-50 text-purple-600',
      orange: isActive ? 'bg-orange-100 text-orange-700 border-orange-200' : 'hover:bg-orange-50 text-orange-600',
      indigo: isActive ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'hover:bg-indigo-50 text-indigo-600',
      red: isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'hover:bg-blue-50 text-blue-600',
      teal: isActive ? 'bg-teal-100 text-teal-700 border-teal-200' : 'hover:bg-teal-50 text-teal-600',
      yellow: isActive ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'hover:bg-yellow-50 text-yellow-600',
      gray: isActive ? 'bg-gray-100 text-gray-700 border-gray-200' : 'hover:bg-gray-50 text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 z-50`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ET</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Expérience Tech</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? (
              <Bars3Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? `${getColorClasses(tab.color, true)} border` 
                  : `${getColorClasses(tab.color, false)}`
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && (
                <span className="font-medium">{tab.name}</span>
              )}
              {!isCollapsed && tab.id === 'support' && notifications > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {notifications}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {darkMode ? 'Mode clair' : 'Mode sombre'}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
            <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Notifications
              </span>
            )}
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
