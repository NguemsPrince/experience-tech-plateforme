import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  LightBulbIcon,
  BugIcon,
  StarIcon,
  CogIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import SuggestionCard from './SuggestionCard';
import SuggestionModal from './SuggestionModal';

const SuggestionsDashboard = ({ userRole = 'user' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    category: 'all'
  });
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    votes: 0
  });

  // Mock data - à remplacer par un appel API
  const mockSuggestions = [
    {
      id: 1,
      title: "Ajouter un système de notifications push",
      description: "Il serait utile d'avoir des notifications push pour être alerté en temps réel des mises à jour importantes sur nos projets.",
      type: "feature",
      priority: "high",
      category: "dashboard",
      status: "pending",
      votes: 24,
      views: 156,
      author: "Jean Dupont",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["notifications", "real-time", "mobile"],
      comments: [
        {
          author: "Marie Martin",
          content: "Excellente idée ! Cela améliorerait vraiment l'expérience utilisateur.",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 2,
      title: "Bug: Les graphiques ne s'affichent pas sur mobile",
      description: "Sur les appareils mobiles, les graphiques du dashboard ne s'affichent pas correctement. Le problème semble lié au responsive design.",
      type: "bug",
      priority: "critical",
      category: "dashboard",
      status: "in_progress",
      votes: 18,
      views: 89,
      author: "Pierre Durand",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["mobile", "responsive", "charts"],
      comments: []
    },
    {
      id: 3,
      title: "Améliorer l'interface de création de projets",
      description: "L'interface actuelle est un peu complexe. Il faudrait la simplifier avec un assistant étape par étape.",
      type: "improvement",
      priority: "medium",
      category: "projects",
      status: "approved",
      votes: 12,
      views: 67,
      author: "Sophie Laurent",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["ux", "wizard", "simplification"],
      comments: []
    },
    {
      id: 4,
      title: "Ajouter un mode sombre pour l'interface",
      description: "Un mode sombre serait apprécié, surtout pour les utilisateurs qui travaillent tard le soir.",
      type: "feature",
      priority: "low",
      category: "ui",
      status: "completed",
      votes: 45,
      views: 234,
      author: "Alexandre Moreau",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["dark-mode", "accessibility", "preferences"],
      comments: [
        {
          author: "Admin",
          content: "Fonctionnalité implémentée dans la dernière mise à jour !",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  ];

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuggestions(mockSuggestions);
      calculateStats(mockSuggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (suggestions) => {
    const stats = {
      total: suggestions.length,
      pending: suggestions.filter(s => s.status === 'pending').length,
      approved: suggestions.filter(s => s.status === 'approved').length,
      completed: suggestions.filter(s => s.status === 'completed').length,
      votes: suggestions.reduce((sum, s) => sum + (s.votes || 0), 0)
    };
    setStats(stats);
  };

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(suggestion => {
      const matchesSearch = suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           suggestion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           suggestion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filters.type === 'all' || suggestion.type === filters.type;
      const matchesStatus = filters.status === 'all' || suggestion.status === filters.status;
      const matchesPriority = filters.priority === 'all' || suggestion.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || suggestion.category === filters.category;

      return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [suggestions, searchQuery, filters]);

  const sortedSuggestions = useMemo(() => {
    const sorted = [...filteredSuggestions];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'most_voted':
        return sorted.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      case 'least_voted':
        return sorted.sort((a, b) => (a.votes || 0) - (b.votes || 0));
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
      default:
        return sorted;
    }
  }, [filteredSuggestions, sortBy]);

  const handleSuggestionSubmit = (newSuggestion) => {
    setSuggestions(prev => [newSuggestion, ...prev]);
    calculateStats([newSuggestion, ...suggestions]);
  };

  const handleVote = (suggestionId, voteType) => {
    setSuggestions(prev => prev.map(suggestion => {
      if (suggestion.id === suggestionId) {
        const newVotes = suggestion.votes || 0;
        return {
          ...suggestion,
          votes: voteType === 'up' ? newVotes + 1 : Math.max(0, newVotes - 1)
        };
      }
      return suggestion;
    }));
    calculateStats(suggestions);
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      priority: 'all',
      category: 'all'
    });
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
            Suggestions & Améliorations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Proposez des améliorations et votez pour les idées de la communauté
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nouvelle suggestion</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">En attente</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Approuvées</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.completed}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Terminées</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.votes}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Votes</div>
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="most_voted">Plus voté</option>
              <option value="least_voted">Moins voté</option>
              <option value="priority">Par priorité</option>
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
        {sortedSuggestions.length > 0 ? (
          sortedSuggestions.map(suggestion => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onVote={handleVote}
              userRole={userRole}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <LightBulbIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune suggestion trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || Object.values(filters).some(f => f !== 'all')
                ? 'Aucune suggestion ne correspond à vos critères de recherche.'
                : 'Soyez le premier à proposer une amélioration !'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Proposer une suggestion
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <SuggestionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuggestionSubmit}
      />
    </div>
  );
};

export default SuggestionsDashboard;
