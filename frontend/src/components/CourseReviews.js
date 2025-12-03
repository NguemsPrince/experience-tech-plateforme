import React, { useState, useEffect } from 'react';
import { 
  StarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftIcon,
  FunnelIcon,
  BarsArrowUpIcon,
  UserIcon,
  CalendarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HandThumbUpIcon as ThumbUpSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const CourseReviews = ({ courseId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    recommend: true
  });

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Mock data for now
      setReviews([
        {
          _id: 1,
          rating: 5,
          title: "Excellente formation React !",
          content: "Cette formation est vraiment complète et bien structurée. L'instructeur explique très bien et les projets pratiques sont très utiles. Je recommande vivement !",
          author: {
            name: "Marie Claire Nguema",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3",
            isVerified: true,
            coursesCompleted: 12
          },
          createdAt: "2024-01-15T10:30:00Z",
          helpful: 15,
          isHelpful: false,
          instructorResponse: {
            content: "Merci beaucoup pour votre retour positif ! Je suis ravi que la formation vous ait plu.",
            author: {
              name: "Jean Paul Mballa",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3",
              isInstructor: true
            },
            createdAt: "2024-01-15T11:00:00Z"
          }
        },
        {
          _id: 2,
          rating: 4,
          title: "Très bonne formation avec quelques points d'amélioration",
          content: "La formation est globalement très bien faite. Le contenu est de qualité et l'instructeur est compétent. Cependant, j'aurais aimé plus d'exercices pratiques et certains concepts pourraient être expliqués plus en détail.",
          author: {
            name: "Paul Biya",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
            isVerified: false,
            coursesCompleted: 5
          },
          createdAt: "2024-01-14T14:20:00Z",
          helpful: 8,
          isHelpful: true,
          instructorResponse: null
        },
        {
          _id: 3,
          rating: 5,
          title: "Parfait pour débuter avec React",
          content: "En tant que débutant en React, cette formation m'a permis de comprendre les concepts fondamentaux. Les exemples sont clairs et la progression est bien pensée.",
          author: {
            name: "Fatou Diallo",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3",
            isVerified: true,
            coursesCompleted: 8
          },
          createdAt: "2024-01-13T09:15:00Z",
          helpful: 12,
          isHelpful: false,
          instructorResponse: null
        }
      ]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour laisser un avis.');
      return;
    }

    try {
      const review = {
        ...newReview,
        author: {
          name: user?.name || "Utilisateur",
          avatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
          isVerified: false,
          coursesCompleted: 0
        },
        createdAt: new Date().toISOString(),
        helpful: 0,
        isHelpful: false,
        instructorResponse: null
      };

      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, title: '', content: '', recommend: true });
      setShowReviewForm(false);
      alert('Votre avis a été publié avec succès !');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Erreur lors de la publication de votre avis.');
    }
  };

  const handleHelpfulToggle = (reviewId) => {
    setReviews(reviews.map(review => {
      if (review._id === reviewId) {
        return {
          ...review,
          isHelpful: !review.isHelpful,
          helpful: review.isHelpful ? review.helpful - 1 : review.helpful + 1
        };
      }
      return review;
    }));
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            {star <= rating ? (
              <StarSolidIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <StarIcon className="w-5 h-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingStats = () => {
    const total = reviews.length;
    if (total === 0) return { average: 0, distribution: {} };

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;

    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = reviews.filter(review => review.rating === i).length;
    }

    return { average, distribution, total };
  };

  const filteredAndSortedReviews = () => {
    let filtered = reviews;

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'helpful':
          return b.helpful - a.helpful;
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  };

  const stats = getRatingStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Avis des étudiants</h3>
          <p className="text-gray-600">Découvrez ce que pensent les autres étudiants de ce cours</p>
        </div>
        <button
          onClick={() => setShowReviewForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Laisser un avis
        </button>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-bold mb-4">Donner votre avis</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note globale
                </label>
                <div className="flex items-center space-x-2">
                  {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
                  <span className="text-sm text-gray-600 ml-2">{newReview.rating}/5</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de votre avis
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Résumez votre expérience en quelques mots"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre avis détaillé
                </label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Partagez votre expérience avec ce cours. Qu'avez-vous aimé ? Y a-t-il des points d'amélioration ?"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recommend"
                  checked={newReview.recommend}
                  onChange={(e) => setNewReview({...newReview, recommend: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="recommend" className="ml-2 text-sm text-gray-700">
                  Je recommande ce cours
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Publier l'avis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.average.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(stats.average))}
            </div>
            <div className="text-sm text-gray-600">
              Basé sur {stats.total} avis
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-2">{rating}</span>
                <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ 
                      width: `${stats.total > 0 ? (stats.distribution[rating] / stats.total) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {stats.distribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4 text-gray-500" />
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les notes</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <BarsArrowUpIcon className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Plus récents</option>
            <option value="helpful">Plus utiles</option>
            <option value="rating-high">Meilleures notes</option>
            <option value="rating-low">Notes les plus basses</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredAndSortedReviews().map((review) => (
          <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <img
                  src={review.author.avatar}
                  alt={review.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{review.author.name}</h4>
                    {review.author.isVerified && (
                      <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      ({review.author.coursesCompleted} cours)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </div>

            {/* Review Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleHelpfulToggle(review._id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                  review.isHelpful 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                  {review.isHelpful ? (
                    <ThumbUpSolidIcon className="w-4 h-4" />
                  ) : (
                    <HandThumbUpIcon className="w-4 h-4" />
                  )}
                <span>Utile ({review.helpful})</span>
              </button>

              <button className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span>Signaler</span>
              </button>
            </div>

            {/* Instructor Response */}
            {review.instructorResponse && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <img
                    src={review.instructorResponse.author.avatar}
                    alt={review.instructorResponse.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-purple-600">
                        {review.instructorResponse.author.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Instructeur
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.instructorResponse.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.instructorResponse.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedReviews().length === 0 && (
        <div className="text-center py-12">
          <StarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun avis trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            {filterRating !== 'all' 
              ? "Aucun avis ne correspond à vos critères de filtrage."
              : "Soyez le premier à laisser un avis sur ce cours !"
            }
          </p>
          {filterRating === 'all' && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Laisser le premier avis
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseReviews;
