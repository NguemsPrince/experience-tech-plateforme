import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const ServiceCard = ({ service, index = 0 }) => {
  const { title, description, image, features, price, duration, category, icon: Icon } = service;

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover-solar group"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
    >
      {/* Effet de brillance au survol (style Impression ND) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none z-10"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Image avec effet parallaxe */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onError={(e) => {
            // Fallback vers gradient si l'image ne charge pas
            e.target.style.display = 'none';
            const fallback = e.target.nextElementSibling;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        {/* Fallback gradient si l'image ne charge pas */}
        {Icon && (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center" style={{display: 'none'}}>
            <Icon className="w-20 h-20 text-white opacity-80" />
          </div>
        )}
        
        {/* Overlay au survol */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        
        {/* Badge animé pour la catégorie */}
        {category && (
          <motion.div
            className="absolute top-4 left-4"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              {category}
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 relative z-0">
        {/* Titre avec animation */}
        <motion.h3
          className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.1 }}
        >
          {title}
        </motion.h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
          {description}
        </p>

        {/* Features List */}
        {features && features.length > 0 && (
          <ul className="space-y-2 mb-4">
            {features.slice(0, 3).map((feature, idx) => (
              <motion.li 
                key={idx} 
                className="flex items-center text-sm text-gray-600"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + idx * 0.05 + 0.2 }}
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                {feature}
              </motion.li>
            ))}
          </ul>
        )}

        {/* Price and Duration */}
        {(price || duration) && (
          <div className="flex justify-between items-center mb-4">
            {price && <span className="text-lg font-bold text-gray-900">{price}</span>}
            {duration && (
              <span className="text-sm text-gray-500">
                {typeof duration === 'string' 
                  ? duration 
                  : duration && typeof duration === 'object' 
                    ? 'Variable' 
                    : '-'}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          to={service.href || `/services/${service.id}`}
          className="inline-flex items-center w-full justify-center bg-gray-900 text-white hover:bg-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          En savoir plus
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
