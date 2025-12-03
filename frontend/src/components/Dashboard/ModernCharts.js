import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowPathIcon,
  MinusIcon,
  PlusIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline';

const ModernCharts = ({ darkMode, chartData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [zoomLevel, setZoomLevel] = useState(100);

  const periods = [
    { id: '7days', label: 'Derniers 7 jours' },
    { id: '30days', label: 'Derniers 30 jours' },
    { id: '90days', label: 'Derniers 90 jours' },
    { id: '1year', label: 'Dernière année' }
  ];

  // Utiliser les données passées en props ou des données par défaut
  const defaultChartData = [
    { day: 'Lun', value: 28000 },
    { day: 'Mar', value: 30000 },
    { day: 'Mer', value: 32000 },
    { day: 'Jeu', value: 29000 },
    { day: 'Ven', value: 26000 },
    { day: 'Sam', value: 23000 },
    { day: 'Dim', value: 25000 }
  ];

  const safeChartData = chartData || defaultChartData;
  const maxValue = Math.max(...safeChartData.map(d => d.value));

  // Device access data
  const deviceData = [
    { type: 'Desktop', percentage: 60, color: 'bg-blue-500', icon: ComputerDesktopIcon },
    { type: 'Mobile', percentage: 30, color: 'bg-green-500', icon: DevicePhoneMobileIcon },
    { type: 'Tablet', percentage: 10, color: 'bg-orange-500', icon: DeviceTabletIcon }
  ];

  return (
    <div className="space-y-8">
      {/* Projects Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Projets par période
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Évolution des projets sur la période sélectionnée
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>

            {/* Refresh Button */}
            <button className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
            }`}>
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Projets
            </span>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map((y, index) => (
              <line
                key={index}
                x1="0"
                y1={y * 2}
                x2="400"
                y2={y * 2}
                stroke={darkMode ? '#374151' : '#E5E7EB'}
                strokeWidth="1"
              />
            ))}

            {/* Chart Line */}
            <motion.polyline
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              points={safeChartData.map((point, index) => {
                const x = (index / (safeChartData.length - 1)) * 350 + 25;
                const y = 200 - (point.value / maxValue) * 150 - 25;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            {/* Data Points */}
            {safeChartData.map((point, index) => {
              const x = (index / (safeChartData.length - 1)) * 350 + 25;
              const y = 200 - (point.value / maxValue) * 150 - 25;
              
              return (
                <motion.circle
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#8B5CF6"
                  className="hover:r-6 transition-all duration-200 cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Y-axis Labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>30k</span>
            <span>28k</span>
            <span>26k</span>
            <span>23k</span>
            <span>20k</span>
          </div>

          {/* X-axis Labels */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 dark:text-gray-400 px-6">
            {safeChartData.map((point, index) => (
              <span key={index}>{point.day}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Device Access Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Accès par appareil
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Répartition des accès par type d'appareil
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {/* Donut Chart */}
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={darkMode ? '#374151' : '#E5E7EB'}
                strokeWidth="8"
              />
              
              {/* Data Segments */}
              {deviceData.map((device, index) => {
                const Icon = device.icon;
                const circumference = 2 * Math.PI * 40;
                const strokeDasharray = `${(device.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = deviceData.slice(0, index).reduce((acc, d) => acc - (d.percentage / 100) * circumference, 0);
                
                return (
                  <motion.circle
                    key={device.type}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray }}
                    transition={{ delay: 0.8 + index * 0.2, duration: 1 }}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={device.color.replace('bg-', '#')}
                    strokeWidth="8"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  100%
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="ml-8 space-y-3">
            {deviceData.map((device, index) => {
              const Icon = device.icon;
              return (
                <motion.div
                  key={device.type}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className={`w-4 h-4 rounded-full ${device.color}`}></div>
                  <Icon className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {device.type}: {device.percentage}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModernCharts;
