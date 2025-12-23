import React, { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlayIcon,
  TrophyIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import trainingService from '../services/training';
import LoadingSpinner from './LoadingSpinner';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('enrolled');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMyCourses();
  }, [status, currentPage]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trainingService.getMyCourses(status, currentPage, 10);
      if (response && response.success && response.data) {
        setEnrollments(response.data.enrollments || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setEnrollments([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching my courses:', error);
      
      // Déterminer le message d'erreur spécifique
      let errorMessage = 'Impossible de charger vos formations.';
      
      if (!error.response) {
        // Erreur réseau - pas de réponse du serveur
        errorMessage = 'Le serveur ne répond pas. Vérifiez que le backend est démarré sur http://localhost:5000';
      } else if (error.response.status === 401) {
        // Non authentifié
        errorMessage = 'Vous devez être connecté pour voir vos formations.';
      } else if (error.response.status === 403) {
        // Accès refusé
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      } else if (error.response.status === 404) {
        // Route non trouvée
        errorMessage = 'Service non disponible. Veuillez contacter le support.';
      } else if (error.response.status >= 500) {
        // Erreur serveur
        errorMessage = error.response.data?.message || 'Erreur serveur. L\'équipe technique a été notifiée.';
      } else if (error.response.data?.message) {
        // Message personnalisé du serveur
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Message d'erreur générique
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setEnrollments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enrolled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'enrolled':
        return 'Inscrit';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes Formations
        </h1>
        <p className="text-gray-600">
          Gérez vos inscriptions et suivez votre progression
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <h3 className="text-sm font-semibold text-blue-800 mb-1">
                Erreur lors du chargement
              </h3>
              <p className="text-sm text-blue-700">{error}</p>
              <button
                onClick={fetchMyCourses}
                className="mt-2 text-sm text-blue-800 hover:text-blue-900 underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {[
            { value: 'enrolled', label: 'En cours', count: enrollments.length },
            { value: 'completed', label: 'Terminées', count: 0 },
            { value: 'all', label: 'Toutes', count: enrollments.length }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatus(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                status === filter.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {!error && enrollments.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune formation trouvée
          </h3>
          <p className="text-gray-600 mb-6">
            {status === 'enrolled' 
              ? "Vous n'êtes inscrit à aucune formation pour le moment."
              : "Aucune formation dans cette catégorie."
            }
          </p>
          <a
            href="/training"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Découvrir les formations
          </a>
        </div>
      )}

      {!error && enrollments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Course Image */}
              <div className="relative">
                <img
                  src={enrollment.course.image}
                  alt={enrollment.course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(enrollment.status)}`}>
                    {getStatusText(enrollment.status)}
                  </span>
                </div>

                {/* Progress Badge */}
                {enrollment.status === 'enrolled' && (
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-xs font-semibold">
                    {enrollment.progress}%
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {enrollment.course.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {enrollment.course.duration}
                </div>

                {/* Progress Bar */}
                {enrollment.status === 'enrolled' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progression</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(enrollment.progress)}`}
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Course Details */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(enrollment.enrollmentDate).toLocaleDateString('fr-FR')}
                  </div>
                  {enrollment.status === 'completed' && (
                    <div className="flex items-center text-green-600">
                      <TrophyIcon className="w-4 h-4 mr-1" />
                      Certificat
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {enrollment.status === 'enrolled' && (
                    <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                      <PlayIcon className="w-4 h-4 mr-2" />
                      Continuer
                    </button>
                  )}
                  
                  {enrollment.status === 'completed' && (
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                      <TrophyIcon className="w-4 h-4 mr-2" />
                      Voir certificat
                    </button>
                  )}

                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Précédent
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
