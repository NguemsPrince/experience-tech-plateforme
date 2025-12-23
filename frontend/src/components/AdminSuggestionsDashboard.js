import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import SuggestionCard from './SuggestionCard';
import { suggestionsService } from '../services/suggestions';

const AdminSuggestionsDashboard = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadSuggestions();
    loadStats();
  }, []);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await suggestionsService.getAllSuggestions(filters);
      if (response.success) {
        setSuggestions(response.data || []);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await suggestionsService.getSuggestionStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(suggestion => {
      const matchesSearch = suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           suggestion.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || suggestion.status === filters.status;
      const matchesType = filters.type === 'all' || suggestion.type === filters.type;
      const matchesPriority = filters.priority === 'all' || suggestion.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });
  }, [suggestions, searchQuery, filters]);

  const handleApprove = async (id) => {
    try {
      const response = await suggestionsService.approveSuggestion(id);
      if (response.success) {
        setSuggestions(prev => prev.map(s => 
          s.id === id ? { ...s, status: 'approved' } : s
        ));
        loadStats();
      }
    } catch (error) {
      console.error('Error approving suggestion:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await suggestionsService.rejectSuggestion(id, rejectReason);
      if (response.success) {
        setSuggestions(prev => prev.map(s => 
          s.id === id ? { ...s, status: 'rejected' } : s
        ));
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedSuggestion(null);
        loadStats();
      }
    } catch (error) {
      console.error('Error rejecting suggestion:', error);
    }
  };

  const handleMarkInProgress = async (id) => {
    try {
      const response = await suggestionsService.markAsInProgress(id);
      if (response.success) {
        setSuggestions(prev => prev.map(s => 
          s.id === id ? { ...s, status: 'in_progress' } : s
        ));
        loadStats();
      }
    } catch (error) {
      console.error('Error marking as in progress:', error);
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      const response = await suggestionsService.markAsCompleted(id);
      if (response.success) {
        setSuggestions(prev => prev.map(s => 
          s.id === id ? { ...s, status: 'completed' } : s
        ));
        loadStats();
      }
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette suggestion ?')) {
      try {
        const response = await suggestionsService.deleteSuggestion(id);
        if (response.success) {
          setSuggestions(prev => prev.filter(s => s.id !== id));
          loadStats();
        }
      } catch (error) {
        console.error('Error deleting suggestion:', error);
      }
    }
  };

  const clearFilters = () => {
    setFilters({ status: 'all', type: 'all', priority: 'all' });
    setSearchQuery('');
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
            Administration des Suggestions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les suggestions et améliorations proposées par les utilisateurs
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">En attente</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Approuvées</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">En cours</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.completed || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Terminées</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.rejected || 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Rejetées</div>
        </div>
      </div>

      {/* Top Categories Chart */}
      {stats.topCategories && stats.topCategories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Catégories les plus populaires
          </h3>
          <div className="space-y-3">
            {stats.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{category.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(category.count / stats.topCategories[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher dans les suggestions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Tous statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="rejected">Rejeté</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Tous types</option>
              <option value="feature">Fonctionnalités</option>
              <option value="improvement">Améliorations</option>
              <option value="bug">Bugs</option>
              <option value="ui">Interface</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Toutes priorités</option>
              <option value="critical">Critique</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
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

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map(suggestion => (
            <div key={suggestion.id} className="relative">
              <SuggestionCard
                suggestion={suggestion}
                userRole="admin"
                onVote={() => {}} // Admin doesn't vote
              />
              
              {/* Admin Actions Overlay */}
              <div className="absolute top-4 right-4 flex space-x-2">
                {suggestion.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(suggestion.id)}
                      className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                      title="Approuver"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSuggestion(suggestion);
                        setShowRejectModal(true);
                      }}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                      title="Rejeter"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {suggestion.status === 'approved' && (
                  <button
                    onClick={() => handleMarkInProgress(suggestion.id)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                    title="Marquer en cours"
                  >
                    <ClockIcon className="w-5 h-5" />
                  </button>
                )}
                
                {suggestion.status === 'in_progress' && (
                  <button
                    onClick={() => handleMarkCompleted(suggestion.id)}
                    className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-colors"
                    title="Marquer terminé"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(suggestion.id)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune suggestion trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Aucune suggestion ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Rejeter la suggestion
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Veuillez indiquer la raison du rejet :
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Expliquez pourquoi cette suggestion est rejetée..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedSuggestion(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => selectedSuggestion && handleReject(selectedSuggestion.id)}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Rejeter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSuggestionsDashboard;
