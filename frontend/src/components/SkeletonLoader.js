import React from 'react';
import { motion } from 'framer-motion';

/**
 * Composant Skeleton Loader pour les pages principales
 * Améliore l'expérience utilisateur pendant le chargement
 */
const SkeletonLoader = ({ type = 'grid', count = 6 }) => {
  const variants = {
    grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    list: 'space-y-4',
    card: 'grid-cols-1 gap-6',
    course: 'space-y-4',
    dashboard: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
  };

  const SkeletonCard = () => (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-200 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
        
        {/* Subtitle */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );

  const SkeletonListItem = () => (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start space-x-4">
        {/* Avatar/Image */}
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );

  const SkeletonCourse = () => (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="w-full h-56 bg-gray-200 animate-pulse" />
      
      {/* Content */}
      <div className="p-6">
        {/* Badge */}
        <div className="h-6 bg-gray-200 rounded-full w-24 mb-4 animate-pulse" />
        
        {/* Title */}
        <div className="h-7 bg-gray-200 rounded w-full mb-3 animate-pulse" />
        
        {/* Instructor */}
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
        
        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
        
        {/* Description */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
        
        {/* Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );

  const SkeletonDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className={variants[type]} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {[...Array(count || 4)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            {/* Label */}
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
            
            {/* Value */}
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
            
            {/* Change */}
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          </motion.div>
        ))}
      </div>
      
      {/* Chart */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    </>
  );

  return (
    <div className={variants[type] || ''}>
      {type === 'grid' && [...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
      
      {type === 'list' && [...Array(count)].map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
      
      {type === 'course' && [...Array(count)].map((_, i) => (
        <SkeletonCourse key={i} />
      ))}
      
      {type === 'dashboard' && <SkeletonDashboard />}
    </div>
  );
};

export default SkeletonLoader;

