import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { IMAGES, handleImageError } from '../config/images';

const TestimonialCard = ({ testimonial }) => {
  const { name, position, content, rating, avatar, fallbackAvatar } = testimonial;

  return (
    <div className="card">
      <div className="p-8">
        {/* Rating */}
        <div className="flex items-center mb-4">
          {[...Array(rating)].map((_, index) => (
            <StarIcon key={index} className="w-5 h-5 text-yellow-400" />
          ))}
        </div>

        {/* Content */}
        <blockquote className="text-gray-700 mb-6 leading-relaxed">
          "{content}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover mr-4"
            onError={(e) => handleImageError(e, fallbackAvatar || IMAGES.fallback.avatar)}
          />
          <div>
            <div className="font-semibold text-gray-900">{name}</div>
            <div className="text-sm text-gray-600">{position}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
