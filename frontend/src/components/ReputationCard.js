import React from 'react';
import { motion } from 'framer-motion';
import {
  TrophyIcon,
  FireIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const ReputationCard = ({ reputation, showDetails = true }) => {
  if (!reputation) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Chargement...</p>
      </div>
    );
  }

  const { points, level, stats, badges } = reputation;

  // Calculer la progression vers le prochain niveau
  const pointsForNextLevel = Math.pow(level, 2) * 100;
  const pointsForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const progressPercentage = ((points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;

  const statsData = [
    {
      icon: ChatBubbleLeftRightIcon,
      label: 'Sujets créés',
      value: stats?.postsCreated || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      label: 'Commentaires',
      value: stats?.commentsCreated || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: HeartIcon,
      label: 'Likes reçus',
      value: stats?.likesReceived || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: CheckCircleIcon,
      label: 'Solutions acceptées',
      value: stats?.solutionsAccepted || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: CalendarIcon,
      label: 'Jours consécutifs',
      value: stats?.consecutiveDays || 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-100">
      {/* Header avec niveau et points */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-full"
          >
            <TrophyIcon className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Niveau {level}</h3>
            <p className="text-gray-600">{points.toLocaleString()} points</p>
          </div>
        </div>
        
        {badges && badges.length > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500 text-xl">🏆</span>
            <span className="font-semibold text-gray-700">{badges.length} badge{badges.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Barre de progression */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Niveau {level}</span>
          <span>Niveau {level + 1}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full relative"
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </motion.div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          {Math.max(0, pointsForNextLevel - points).toLocaleString()} points pour le niveau suivant
        </p>
      </div>

      {/* Statistiques détaillées */}
      {showDetails && stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`${stat.bgColor} rounded-lg p-3 flex flex-col items-center text-center`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mb-1`} />
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message d'encouragement */}
      {stats && stats.consecutiveDays > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center space-x-2"
        >
          <FireIcon className="w-5 h-5 text-orange-500" />
          <p className="text-sm text-orange-800">
            <span className="font-semibold">{stats.consecutiveDays} jour{stats.consecutiveDays > 1 ? 's' : ''} d'affilée</span> - Continuez comme ça !
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ReputationCard;


