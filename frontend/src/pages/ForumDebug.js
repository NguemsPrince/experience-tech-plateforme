import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
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
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import LoadingSpinner from '../components/LoadingSpinner';
// import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const ForumDebug = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des catégories...');
      const categoriesResponse = await api.get('/forum/categories');
      console.log('✅ Catégories chargées:', categoriesResponse.data);
      setCategories(categoriesResponse.data.data || []);
      
      console.log('🔄 Chargement des posts...');
      const postsResponse = await api.get('/forum/posts', {
        params: { page: 1, limit: 10, sort: 'newest' }
      });
      console.log('✅ Posts chargés:', postsResponse.data);
      setPosts(postsResponse.data.data.posts || []);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      setError(error.message);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSpinner size="large" text="Chargement du forum..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Erreur de chargement</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-4">
            <ChatBubbleLeftRightIcon className="w-8 h-8 mr-3 text-blue-600" />
            Forum Expérience Tech - Debug
          </h1>
          <p className="text-gray-600">
            Discutez, posez des questions et partagez vos connaissances
          </p>
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Informations de debug :</h3>
          <p><strong>Catégories chargées :</strong> {categories.length}</p>
          <p><strong>Posts chargés :</strong> {posts.length}</p>
          <p><strong>Utilisateur connecté :</strong> {user ? 'Oui' : 'Non'}</p>
        </div>

        {/* Catégories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Catégories ({categories.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-all"
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
              </div>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Toutes les discussions ({posts.length})
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Aucune discussion trouvée</p>
              <p className="text-sm">Soyez le premier à créer une discussion !</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="mr-4">
                          Par {post.author?.firstName} {post.author?.lastName}
                        </span>
                        <span className="mr-4">
                          {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="mr-4">
                          {post.views} vues
                        </span>
                        <span className="mr-4">
                          {post.likes?.length || 0} likes
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span 
                          className="px-2 py-1 text-xs rounded-full text-white"
                          style={{ backgroundColor: post.category?.color }}
                        >
                          {post.category?.name}
                        </span>
                        {post.tags?.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <HeartIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumDebug;
