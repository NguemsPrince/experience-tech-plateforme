import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  ClockIcon,
  BookOpenIcon,
  PlayIcon,
  ShoppingCartIcon,
  StarIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import SolarAnimation from './SolarAnimation';

const CourseCard = ({ course, viewMode = 'grid', onAddToCart, onRateCourse }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showHoverInfo, setShowHoverInfo] = useState(false);
  const [showAddNotification, setShowAddNotification] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(course);
      setShowAddNotification(true);
      setTimeout(() => setShowAddNotification(false), 2000);
    }
  };

  const handleRateCourse = (e, rating) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRateCourse) {
      onRateCourse(course, rating);
    }
  };

  const getDiscountPercentage = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (viewMode === 'list') {
    return (
      <SolarAnimation variant="solar" delay={Math.random() * 0.5}>
        <motion.div
          className="group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ 
            y: -2, 
            scale: 1.01,
            transition: { type: "spring", stiffness: 400, damping: 17 }
          }}
          whileTap={{ scale: 0.99 }}
        >
        <Link to={`/course/${course._id}`} className="block">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover-solar border border-gray-100">
            <div className="flex">
              {/* Image */}
              <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay avec bouton play */}
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                  isHovered ? 'bg-opacity-30' : 'bg-opacity-0'
                } flex items-center justify-center`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-full p-2 shadow-lg"
                  >
                    <PlayIcon className="w-4 h-4 text-gray-800" />
                  </motion.div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {course.isBestSeller && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Best Seller
                    </span>
                  )}
                  {course.isNew && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Nouveau
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start h-full">
                  <div className="flex-1">
                    {/* Category */}
                    <div className="text-xs text-red-500 font-semibold mb-1 uppercase tracking-wide">
                      {typeof course.category === 'string' ? course.category : (course.category?.name || 'Non défini')}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg group-hover:text-red-600 transition-colors duration-200">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Instructor */}
                    <div className="flex items-center mb-3">
                      <img
                        src={course.instructorImage}
                        alt={typeof course.instructor === 'object' ? course.instructor.name : course.instructor}
                        className="w-5 h-5 rounded-full mr-2"
                      />
                      <span className="text-xs text-gray-600">
                        {typeof course.instructor === 'object' ? course.instructor.name : course.instructor}
                      </span>
                    </div>

                    {/* Rating and Details */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-gray-900 mr-1">
                            {typeof course.rating === 'object' ? course.rating.average : course.rating}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarSolidIcon
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(typeof course.rating === 'object' ? course.rating.average : course.rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            ({course.studentsCount})
                          </span>
                        </div>

                        <div className="flex items-center text-xs text-gray-600 space-x-3">
                          <div className="flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {course.totalHours}h
                          </div>
                          <div className="flex items-center">
                            <BookOpenIcon className="w-3 h-3 mr-1" />
                            {course.lessons} leçons
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-col items-end justify-between h-full ml-4">
                    <button
                      onClick={toggleFavorite}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200"
                    >
                      {isFavorited ? (
                        <HeartSolidIcon className="w-4 h-4 text-red-500" />
                      ) : (
                        <HeartIcon className="w-4 h-4 text-gray-600" />
                      )}
                    </button>

                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          {course.price.toLocaleString('fr-FR')} FCFA
                        </span>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {course.originalPrice.toLocaleString('fr-FR')} FCFA
                          </span>
                        )}
                      </div>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <div className="text-xs text-red-500 font-semibold">
                          -{getDiscountPercentage(course.originalPrice, course.price)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
        </motion.div>
      </SolarAnimation>
    );
  }

  return (
    <SolarAnimation variant="solar" delay={Math.random() * 0.5}>
      <motion.div
        className="group cursor-pointer relative"
        onMouseEnter={() => {
          setIsHovered(true);
          setShowHoverInfo(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowHoverInfo(false);
        }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          transition: { type: "spring", stiffness: 400, damping: 17 }
        }}
        whileTap={{ scale: 0.98 }}
      >
      <Link to={`/course/${course._id}`} className="block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover-solar border border-gray-100">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay avec bouton play */}
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isHovered ? 'bg-opacity-30' : 'bg-opacity-0'
            } flex items-center justify-center`}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-full p-3 shadow-lg"
              >
                <PlayIcon className="w-6 h-6 text-gray-800" />
              </motion.div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {course.isBestSeller && (
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                  Best Seller
                </span>
              )}
              {course.isNew && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                  Nouveau
                </span>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={toggleFavorite}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200"
              >
                {isFavorited ? (
                  <HeartSolidIcon className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={handleAddToCart}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200 relative"
                title="Ajouter au panier"
              >
                <ShoppingCartIcon className="w-4 h-4 text-gray-600" />
                {showAddNotification && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
                  >
                    ✓
                  </motion.div>
                )}
              </button>
            </div>

            {/* Discount Badge */}
            {course.originalPrice && course.originalPrice > course.price && (
              <div className="absolute bottom-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                -{getDiscountPercentage(course.originalPrice, course.price)}%
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <div className="text-xs text-red-500 font-semibold mb-2 uppercase tracking-wide">
              {typeof course.category === 'string' ? course.category : (course.category?.name || 'Non défini')}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-red-600 transition-colors duration-200">
              {course.title}
            </h3>

            {/* Instructor */}
            <div className="flex items-center mb-3">
              <img
                src={course.instructorImage}
                alt={typeof course.instructor === 'object' ? course.instructor.name : course.instructor}
                className="w-5 h-5 rounded-full mr-2"
              />
              <span className="text-xs text-gray-600">
                {typeof course.instructor === 'object' ? course.instructor.name : course.instructor}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center mr-2">
                <span className="text-sm font-bold text-gray-900 mr-1">
                  {typeof course.rating === 'object' ? course.rating.average : course.rating}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(typeof course.rating === 'object' ? course.rating.average : course.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500">
                ({course.studentsCount} étudiants)
              </span>
            </div>

            {/* Course Details */}
            <div className="flex items-center text-xs text-gray-600 mb-3 space-x-3">
              <div className="flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                {course.totalHours}h
              </div>
              <div className="flex items-center">
                <BookOpenIcon className="w-3 h-3 mr-1" />
                {course.lessons} leçons
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  {course.price.toLocaleString('fr-FR')} FCFA
                </span>
                {course.originalPrice && course.originalPrice > course.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {course.originalPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                )}
              </div>
            </div>

            {/* Système de notation */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Noter cette formation:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={(e) => handleRateCourse(e, star)}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                    >
                      <StarIcon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Informations supplémentaires au survol */}
      {showHoverInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
        >
          <div className="space-y-3">
            {/* Description détaillée */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {course.description}
              </p>
            </div>

            {/* Informations détaillées */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>Début: {new Date(course.startDate).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UserGroupIcon className="w-4 h-4 mr-2" />
                <span>{course.currentStudents}/{course.maxStudents} étudiants</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                <span>Niveau: {course.level}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BookOpenIcon className="w-4 h-4 mr-2" />
                <span>Langue: {course.language}</span>
              </div>
            </div>

            {/* Prérequis */}
            {course.requirements && course.requirements.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Prérequis</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {course.requirements.slice(0, 3).map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ce que vous apprendrez */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ce que vous apprendrez</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {course.whatYouWillLearn.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {course.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
      </motion.div>
    </SolarAnimation>
  );
};

export default CourseCard;
