import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  AcademicCapIcon,
  UserIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import TrainingModal from './TrainingModal';
import QuickAddModal from './QuickAddModal';
import { trainingsService } from '../services/trainings';

const TrainingsDashboard = ({ userRole = 'user' }) => {
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    status: 'all'
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadTrainings();
    loadStats();
  }, []);

  const loadTrainings = async () => {
    setIsLoading(true);
    try {
      const response = await trainingsService.getAllTrainings(filters);
      if (response.success) {
        // S'assurer que response.data est un tableau
        const trainingsData = response.data;
        if (Array.isArray(trainingsData)) {
          setTrainings(trainingsData);
        } else if (trainingsData && Array.isArray(trainingsData.trainings)) {
          setTrainings(trainingsData.trainings);
        } else if (trainingsData && Array.isArray(trainingsData.courses)) {
          setTrainings(trainingsData.courses);
        } else {
          console.warn('Response data is not an array:', trainingsData);
          setTrainings([]);
        }
      } else {
        setTrainings([]);
      }
    } catch (error) {
      console.error('Error loading trainings:', error);
      setTrainings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await trainingsService.getTrainingStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filteredTrainings = useMemo(() => {
    // S'assurer que trainings est un tableau avant de filtrer
    if (!Array.isArray(trainings)) {
      console.warn('trainings is not an array:', trainings);
      return [];
    }
    
    return trainings.filter(training => {
      // Vérifier que training existe et a les propriétés nécessaires
      if (!training || !training.title || !training.description || !training.instructor) {
        return false;
      }
      
      const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           training.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           training.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || training.category === filters.category;
      const matchesLevel = filters.level === 'all' || training.level === filters.level;
      const matchesStatus = filters.status === 'all' || training.status === filters.status;

      return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });
  }, [trainings, searchQuery, filters]);

  const handleTrainingSubmit = (newTraining) => {
    if (selectedTraining) {
      setTrainings(prev => prev.map(t => t.id === selectedTraining.id ? newTraining : t));
    } else {
      setTrainings(prev => [newTraining, ...prev]);
    }
    setSelectedTraining(null);
    loadStats();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        const response = await trainingsService.deleteTraining(id);
        if (response.success) {
          setTrainings(prev => prev.filter(t => t.id !== id));
          loadStats();
        }
      } catch (error) {
        console.error('Error deleting training:', error);
      }
    }
  };

  const handleEnroll = async (id) => {
    try {
      const response = await trainingsService.enrollInTraining(id);
      if (response.success) {
        // Mettre à jour le nombre d'inscrits
        setTrainings(prev => prev.map(t => 
          t.id === id ? { ...t, enrolledStudents: t.enrolledStudents + 1 } : t
        ));
      }
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const clearFilters = () => {
    setFilters({ category: 'all', level: 'all', status: 'all' });
    setSearchQuery('');
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'débutant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermédiaire': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'avancé': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'expert': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Catalogue de Formations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Découvrez et inscrivez-vous à nos formations professionnelles
          </p>
        </div>
        {userRole === 'admin' && (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSelectedTraining(null);
                setShowModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nouvelle formation</span>
            </button>
            <button
              onClick={() => setShowQuickModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Ajout rapide</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Actives</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.upcoming || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">À venir</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalParticipants || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Participants</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.averageRating || 0}/5</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Note moyenne</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Toutes catégories</option>
              <option value="développement">Développement</option>
              <option value="design">Design</option>
              <option value="devops">DevOps</option>
              <option value="marketing">Marketing</option>
              <option value="business">Business</option>
              <option value="data">Data Science</option>
            </select>

            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Tous niveaux</option>
              <option value="débutant">Débutant</option>
              <option value="intermédiaire">Intermédiaire</option>
              <option value="avancé">Avancé</option>
              <option value="expert">Expert</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Tous statuts</option>
              <option value="programmé">Programmé</option>
              <option value="en_cours">En cours</option>
              <option value="terminé">Terminé</option>
              <option value="annulé">Annulé</option>
            </select>

            {(searchQuery || Object.values(filters).some(f => f !== 'all')) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                <span className="text-sm">Effacer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trainings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainings.map(training => (
          <div key={training.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <AcademicCapIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {training.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      par {typeof training.instructor === 'string' ? training.instructor : (training.instructor?.name || 'Instructeur')}
                    </p>
                  </div>
                </div>
                
                {userRole === 'admin' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTraining(training);
                        setShowModal(true);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(training.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {training.description}
              </p>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{training.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {training.enrolledStudents}/{training.maxParticipants}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {new Date(training.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{training.price?.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(typeof training.level === 'string' ? training.level : (training.level?.name || ''))}`}>
                  {typeof training.level === 'string' ? training.level : (training.level?.name || 'Non défini')}
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {typeof training.category === 'string' ? training.category : (training.category?.name || 'Non défini')}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <StarSolid className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {typeof training.rating === 'number' 
                      ? training.rating 
                      : (training.rating?.average || training.rating?.value || 0)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({training.reviews || 0} avis)
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Campagne: {typeof training.category === 'string' 
                    ? training.category 
                    : (training.category?.name || 'Non défini')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <EyeIcon className="w-4 h-4" />
                  <span>Voir détails</span>
                </button>
                <button
                  onClick={() => handleEnroll(training.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>S'inscrire</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTrainings.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune formation trouvée
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || Object.values(filters).some(f => f !== 'all')
              ? 'Aucune formation ne correspond à vos critères de recherche.'
              : 'Aucune formation disponible pour le moment.'}
          </p>
          {userRole === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer une formation
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <TrainingModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTraining(null);
        }}
        onSuccess={handleTrainingSubmit}
        training={selectedTraining}
      />

      <QuickAddModal
        isOpen={showQuickModal}
        onClose={() => setShowQuickModal(false)}
        onSuccess={(newTraining) => {
          setTrainings(prev => [newTraining, ...prev]);
          setShowQuickModal(false);
        }}
        type="training"
      />
    </div>
  );
};

export default TrainingsDashboard;
