import React, { useState, useEffect, useCallback } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { getAllTestimonials, getTestimonialStats, markTestimonialHelpful } from '../services/testimonialService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    rating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTestimonials: 0,
    hasNext: false,
    hasPrev: false
  });

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'plateforme', label: 'Plateforme générale' },
    { value: 'service', label: 'Services' },
    { value: 'formation', label: 'Formations' },
    { value: 'support', label: 'Support client' },
    { value: 'autre', label: 'Autre' }
  ];

  const ratings = [
    { value: '', label: 'Toutes les notes' },
    { value: '5', label: '5 étoiles' },
    { value: '4', label: '4 étoiles' },
    { value: '3', label: '3 étoiles' },
    { value: '2', label: '2 étoiles' },
    { value: '1', label: '1 étoile' }
  ];

  const loadTestimonials = useCallback(async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page,
        limit: 10,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const response = await getAllTestimonials(params);

      if (response.success) {
        if (page === 1) {
          setTestimonials(response.testimonials);
        } else {
          setTestimonials(prev => [...prev, ...response.testimonials]);
        }
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTestimonials();
    loadStats();
  }, []);

  useEffect(() => {
    // Reset pagination when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    loadTestimonials(1);
  }, [filters, loadTestimonials]);

  const loadStats = async () => {
    try {
      const response = await getTestimonialStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleLoadMore = () => {
    if (pagination.hasNext && !loadingMore) {
      loadTestimonials(pagination.currentPage + 1);
    }
  };

  const handleMarkHelpful = async (testimonialId) => {
    try {
      const response = await markTestimonialHelpful(testimonialId);
      if (response.success) {
        // Update the helpful votes count in the local state
        setTestimonials(prev =>
          prev.map(testimonial =>
            testimonial._id === testimonialId
              ? { ...testimonial, helpfulVotes: response.helpfulVotes }
              : testimonial
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      index < rating ? (
        <StarIcon key={index} className="w-5 h-5 text-yellow-400" />
      ) : (
        <StarOutlineIcon key={index} className="w-5 h-5 text-gray-300" />
      )
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Témoignages Clients
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez ce que nos clients disent de leur expérience avec Expérience Tech
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.global.averageRating.toFixed(1)}
                </div>
                <div className="text-gray-600">Note moyenne</div>
                <div className="flex justify-center mt-2">
                  {renderStars(Math.round(stats.global.averageRating))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.global.totalTestimonials}
                </div>
                <div className="text-gray-600">Témoignages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.global.satisfactionRate}%
                </div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.global.distribution[5] || 0}
                </div>
                <div className="text-gray-600">Notes 5★</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ratings.map((rating) => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trier par
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">{t('testimonials.filters.date')}</option>
                <option value="rating">{t('testimonials.filters.rating')}</option>
                <option value="helpfulVotes">{t('testimonials.filters.helpfulness')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordre
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">{t('testimonials.sort.descending')}</option>
                <option value="asc">{t('testimonials.sort.ascending')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {pagination.totalTestimonials} témoignage{pagination.totalTestimonials > 1 ? 's' : ''} trouvé{pagination.totalTestimonials > 1 ? 's' : ''}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="bg-white rounded-lg shadow-lg p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {testimonial.user?.firstName} {testimonial.user?.lastName}
                    </h3>
                    <div className="flex items-center">
                      {renderStars(testimonial.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        ({testimonial.rating}/5)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(testimonial.createdAt)}
                </div>
              </div>

              {/* Category */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {getCategoryLabel(testimonial.category)}
                </span>
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.testimonial}"
              </blockquote>

              {/* Response (if any) */}
              {testimonial.response && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-semibold text-blue-800">
                      Réponse d'Expérience Tech
                    </span>
                    <span className="ml-2 text-xs text-blue-600">
                      {formatDate(testimonial.response.date)}
                    </span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    {testimonial.response.text}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleMarkHelpful(testimonial._id)}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <HandThumbUpIcon className="w-5 h-5 mr-1" />
                  <span className="text-sm">
                    Utile ({testimonial.helpfulVotes})
                  </span>
                </button>
                {testimonial.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    ⭐ Mis en avant
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {pagination.hasNext && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              {loadingMore ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Chargement...
                </>
              ) : (
                'Charger plus de témoignages'
              )}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && testimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Aucun témoignage trouvé avec ces critères.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;

