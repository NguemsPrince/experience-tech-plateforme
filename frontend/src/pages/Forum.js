import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  ChatBubbleLeftRightIcon,
  FireIcon,
  ClockIcon,
  HeartIcon,
  EyeIcon,
  TagIcon,
  FunnelIcon,
  XMarkIcon,
  FlagIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import LoadingSpinner from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute';
import ReportModal from '../components/Forum/ReportModal';
import forumService from '../services/forumService';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const ForumPage = () => {
  const { category, topicId: _topicId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // États
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportPostId, setReportPostId] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({
    author: '',
    tags: [],
    dateFrom: '',
    dateTo: ''
  });

  // État pour savoir si les catégories sont chargées
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Charger les catégories avec useCallback
  const loadCategories = useCallback(async () => {
    try {
      const response = await api.get('/forum/categories');
      // Gérer différentes structures de réponse
      const categoriesData = response.data?.data || response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setCategoriesLoaded(true);
      
      // Si une catégorie est spécifiée dans l'URL, la sélectionner
      if (category && category !== 'all') {
        const foundCategory = categoriesData.find(cat => cat._id === category || cat.id === category);
        if (foundCategory) {
          setSelectedCategory(foundCategory);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      // Ne pas afficher de toast immédiatement pour éviter l'erreur visible
      setCategories([]); // Définir un tableau vide pour éviter l'erreur undefined
      setCategoriesLoaded(true); // Marquer comme chargé même en cas d'erreur
      setLoading(false); // Arrêter le chargement même en cas d'erreur
    }
  }, [category]);

  // Charger les posts avec useCallback
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        sort: sortBy
      };

      if (selectedCategory && selectedCategory._id && selectedCategory._id !== 'all') {
        params.category = selectedCategory._id;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Filtres avancés
      if (advancedFilters.author.trim()) {
        // Note: Cette fonctionnalité nécessiterait un endpoint backend spécifique
        // Pour l'instant, on peut filtrer côté client si nécessaire
      }

      const response = await api.get('/forum/posts', { params });
      // Gérer différentes structures de réponse
      const responseData = response.data?.data || response.data || {};
      const postsData = responseData.posts || responseData || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
      setTotalPages(responseData.pagination?.totalPages || response.data?.pagination?.totalPages || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
      // Ne pas afficher de toast immédiatement pour éviter l'erreur visible
      setPosts([]); // Définir un tableau vide en cas d'erreur
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, selectedCategory, searchQuery]);

  // Charger les catégories
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Charger les posts quand les catégories sont prêtes et quand les paramètres changent
  useEffect(() => {
    if (categoriesLoaded) {
      loadPosts();
    }
  }, [categoriesLoaded, loadPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams({ 
      search: searchQuery, 
      sort: sortBy,
      category: selectedCategory?._id || 'all'
    });
    loadPosts();
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    setSearchParams({ 
      search: searchQuery, 
      sort: sortBy,
      category: cat._id || 'all'
    });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
    setSearchParams({ 
      search: searchQuery, 
      sort: sort,
      category: selectedCategory?._id || 'all'
    });
  };

  const handleLike = async (postId) => {
    if (!user) {
      toast.error('Vous devez être connecté pour liker');
      return;
    }

    try {
      await api.post(`/forum/posts/${postId}/like`);
      loadPosts(); // Recharger pour mettre à jour les likes
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast.error('Erreur lors du like');
    }
  };

  const handleDislike = async (postId) => {
    if (!user) {
      toast.error('Vous devez être connecté pour disliker');
      return;
    }

    try {
      await api.post(`/forum/posts/${postId}/dislike`);
      loadPosts(); // Recharger pour mettre à jour les dislikes
    } catch (error) {
      console.error('Erreur lors du dislike:', error);
      toast.error('Erreur lors du dislike');
    }
  };

  const handleReport = (postId) => {
    if (!user) {
      toast.error('Vous devez être connecté pour signaler');
      return;
    }
    setReportPostId(postId);
    setShowReportModal(true);
  };

  const handleReportSubmit = async (reportData) => {
    try {
      await forumService.reportPost(reportPostId, reportData);
      setShowReportModal(false);
      setReportPostId(null);
      toast.success('Signalement envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      throw error;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Afficher le spinner uniquement lors du chargement initial
  if ((loading && !categoriesLoaded) || (!categoriesLoaded && categories.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Chargement du forum..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <ChatBubbleLeftRightIcon className="w-8 h-8 mr-3 text-blue-600" />
                Forum Expérience Tech
              </h1>
              <p className="text-gray-600 mt-2">
                Discutez, posez des questions et partagez vos connaissances
              </p>
            </div>
            
            {user && (
              <ProtectedRoute>
                <button
                  onClick={() => navigate('/forum/create')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Nouveau sujet
                </button>
              </ProtectedRoute>
            )}
          </div>

          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans le forum..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                  <option value="mostActive">Plus actifs</option>
                  <option value="mostLiked">Plus aimés</option>
                </select>
                
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <FunnelIcon className="w-4 h-4 mr-1" />
                  Filtres
                </button>
                
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Rechercher
                </button>
              </div>
            </form>

            {/* Filtres avancés */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="space-y-4">
                  {/* Catégories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCategoryChange({ _id: 'all', name: 'Toutes les catégories' })}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          !selectedCategory || selectedCategory._id === 'all'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Toutes les catégories
                      </button>
                      {categories?.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => handleCategoryChange(cat)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedCategory?._id === cat._id
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtres supplémentaires */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <UserIcon className="w-4 h-4 inline mr-1" />
                        Auteur
                      </label>
                      <input
                        type="text"
                        placeholder="Nom d'utilisateur..."
                        value={advancedFilters.author}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, author: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Date de début
                      </label>
                      <input
                        type="date"
                        value={advancedFilters.dateFrom}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateFrom: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <CalendarIcon className="w-4 h-4 inline mr-1" />
                        Date de fin
                      </label>
                      <input
                        type="date"
                        value={advancedFilters.dateTo}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateTo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Bouton réinitialiser les filtres */}
                  {(advancedFilters.author || advancedFilters.dateFrom || advancedFilters.dateTo) && (
                    <button
                      onClick={() => {
                        setAdvancedFilters({ author: '', tags: [], dateFrom: '', dateTo: '' });
                        loadPosts();
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Catégories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Catégories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories?.map((cat) => (
              <motion.div
                key={cat._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryChange(cat)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedCategory?._id === cat._id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                    style={{ backgroundColor: cat.color + '20' }}
                  >
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                  <h3 className="font-medium text-gray-900">{cat.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{cat.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{cat.topicsCount} sujets</span>
                  <span>{cat.postsCount} messages</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCategory ? selectedCategory.name : 'Toutes les discussions'}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {posts?.length || 0} discussion{(posts?.length || 0) > 1 ? 's' : ''}
                </span>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 text-sm ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Liste
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 text-sm ${
                      viewMode === 'grid' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Grille
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <LoadingSpinner size="medium" text="Chargement des discussions..." />
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Aucune discussion trouvée</p>
              <p className="text-sm">
                {searchQuery ? 'Essayez de modifier vos critères de recherche' : 'Soyez le premier à créer une discussion !'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 p-6' : 'divide-y divide-gray-200'}>
              {posts?.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1 }}
                  className={`${
                    viewMode === 'grid' 
                      ? 'bg-gray-50 rounded-lg p-4 hover:bg-gray-100' 
                      : 'p-6 hover:bg-gray-50'
                  } transition-all cursor-pointer`}
                  onClick={() => navigate(`/forum/topic/${post._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            📌 Épinglé
                          </span>
                        )}
                        {post.isLocked && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            🔒 Verrouillé
                          </span>
                        )}
                        {post.isResolved && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            ✅ Résolu
                          </span>
                        )}
                        <span 
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: post.category?.color }}
                        >
                          {post.category?.name}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600">
                        {post.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {post.views} vues
                        </span>
                        <span className="flex items-center">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                          {post.commentsCount || 0} réponses
                        </span>
                        <span className="flex items-center">
                          <HeartIcon className="w-4 h-4 mr-1" />
                          {post.likesCount || 0} likes
                        </span>
                      </div>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center"
                            >
                              <TagIcon className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="text-right text-sm text-gray-500">
                        <div>Par {post.author?.name}</div>
                        <div>{formatDate(post.createdAt)}</div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post._id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Like"
                        >
                          <HeartIcon className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDislike(post._id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Dislike"
                        >
                          <HeartIcon className="w-4 h-4 text-gray-400 hover:text-gray-600 rotate-180" />
                        </button>
                        {user && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReport(post._id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Signaler"
                          >
                            <FlagIcon className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {currentPage} sur {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modale de signalement */}
        <ReportModal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setReportPostId(null);
          }}
          onReport={handleReportSubmit}
          contentType="post"
        />
      </div>
    </div>
  );
};

export default ForumPage;