import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { createTestimonial, updateTestimonial, getMyTestimonial } from '../services/testimonialService';
import LoadingSpinner from './LoadingSpinner';

const AddTestimonial = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    testimonial: '',
    category: 'plateforme'
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [existingTestimonial, setExistingTestimonial] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    { value: 'plateforme', label: 'Plateforme générale' },
    { value: 'service', label: 'Services' },
    { value: 'formation', label: 'Formations' },
    { value: 'support', label: 'Support client' },
    { value: 'autre', label: 'Autre' }
  ];

  useEffect(() => {
    checkExistingTestimonial();
  }, []);

  const checkExistingTestimonial = async () => {
    try {
      const response = await getMyTestimonial();
      if (response.success && response.testimonial) {
        setExistingTestimonial(response.testimonial);
        setFormData({
          rating: response.testimonial.rating,
          testimonial: response.testimonial.testimonial,
          category: response.testimonial.category
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du témoignage:', error);
    } finally {
      setCheckingExisting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (formData.rating === 0) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une note' });
      return;
    }

    if (formData.testimonial.trim().length < 10) {
      setMessage({ type: 'error', text: 'Le témoignage doit contenir au moins 10 caractères' });
      return;
    }

    setLoading(true);

    try {
      let response;
      if (existingTestimonial) {
        response = await updateTestimonial(existingTestimonial._id, formData);
      } else {
        response = await createTestimonial(formData);
      }

      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: response.message || 'Témoignage soumis avec succès !' 
        });
        
        if (onSuccess) {
          setTimeout(() => onSuccess(response.testimonial), 2000);
        }
        
        if (!existingTestimonial) {
          // Reset form for new testimonial
          setFormData({ rating: 0, testimonial: '', category: 'plateforme' });
        }
        
        // Refresh existing testimonial
        setTimeout(() => checkExistingTestimonial(), 2000);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Une erreur est survenue lors de l\'envoi de votre témoignage' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (existingTestimonial) {
      setFormData({
        rating: existingTestimonial.rating,
        testimonial: existingTestimonial.testimonial,
        category: existingTestimonial.category
      });
    }
    setMessage({ type: '', text: '' });
  };

  if (checkingExisting) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {existingTestimonial ? 'Votre Témoignage' : 'Partagez Votre Expérience'}
          </h2>
          <p className="text-gray-600">
            {existingTestimonial 
              ? 'Vous avez déjà soumis un témoignage. Vous pouvez le modifier ci-dessous.'
              : 'Votre avis nous aide à améliorer nos services'}
          </p>
        </div>

        {/* Existing testimonial status */}
        {existingTestimonial && !isEditing && (
          <div className={`mb-6 p-4 rounded-lg ${
            existingTestimonial.isApproved 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {existingTestimonial.isApproved ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                ) : (
                  <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className={`text-sm font-medium ${
                  existingTestimonial.isApproved ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {existingTestimonial.isApproved 
                    ? 'Témoignage approuvé et publié' 
                    : 'Témoignage en attente d\'approbation'}
                </h3>
                <div className="mt-2 text-sm">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, index) => (
                      index < existingTestimonial.rating ? (
                        <StarIcon key={index} className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <StarOutlineIcon key={index} className="w-5 h-5 text-gray-300" />
                      )
                    ))}
                    <span className="ml-2 text-gray-600">
                      ({existingTestimonial.rating}/5)
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{existingTestimonial.testimonial}</p>
                  <p className="text-gray-500 text-xs">
                    Catégorie: {categories.find(c => c.value === existingTestimonial.category)?.label}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleEdit}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Modifier mon témoignage
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form (shown if no existing testimonial or if editing) */}
        {(!existingTestimonial || isEditing) && (
          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                Note globale <span className="text-blue-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    {star <= (hoveredRating || formData.rating) ? (
                      <StarIcon className="w-10 h-10 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon className="w-10 h-10 text-gray-300" />
                    )}
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-4 text-gray-600 font-medium">
                    {formData.rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                Catégorie <span className="text-blue-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Testimonial */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                Votre témoignage <span className="text-blue-500">*</span>
              </label>
              <textarea
                value={formData.testimonial}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="6"
                placeholder="Partagez votre expérience avec Expérience Tech..."
                required
                minLength={10}
                maxLength={1000}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Minimum 10 caractères</span>
                <span>{formData.testimonial.length}/1000</span>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                  )}
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Annuler
                </button>
              )}
              <button
                type="submit"
                disabled={loading || formData.rating === 0}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" className="mr-2" />
                    Envoi en cours...
                  </>
                ) : existingTestimonial ? (
                  'Mettre à jour'
                ) : (
                  'Soumettre mon témoignage'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Info note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Votre témoignage sera soumis à une modération avant d'être publié publiquement. 
            Cela nous permet de maintenir la qualité et l'authenticité des retours d'expérience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddTestimonial;


