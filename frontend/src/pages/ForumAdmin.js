import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  FlagIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import LoadingSpinner from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const ForumAdminPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState({ posts: [], comments: [] });
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadReports();
    }
  }, [user]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/forum/admin/reports');
      setReports(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des signalements:', error);
      toast.error('Erreur lors du chargement des signalements');
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (type, id, action) => {
    try {
      await api.put(`/forum/admin/reports/${type}/${id}`, { status: action });
      toast.success(`Signalement ${action === 'reviewed' ? 'examiné' : 'rejeté'}`);
      loadReports(); // Recharger les signalements
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
      toast.error('Erreur lors de l\'action');
    }
  };

  const handleDeleteContent = async (type, id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      return;
    }

    try {
      if (type === 'post') {
        await api.delete(`/forum/posts/${id}`);
      } else {
        await api.delete(`/forum/comments/${id}`);
      }
      toast.success('Contenu supprimé');
      loadReports();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
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

  const getReasonLabel = (reason) => {
    const labels = {
      spam: 'Spam',
      inappropriate: 'Contenu inapproprié',
      'off-topic': 'Hors sujet',
      harassment: 'Harcèlement',
      other: 'Autre'
    };
    return labels[reason] || reason;
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Chargement de l'interface d'administration..." />;
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShieldCheckIcon className="w-8 h-8 mr-3 text-blue-600" />
              Administration du Forum
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les signalements et modérez le contenu du forum
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FlagIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Signalements en attente</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.posts.filter(p => p.reports.some(r => r.status === 'pending')).length + 
                     reports.comments.filter(c => c.reports.some(r => r.status === 'pending')).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Posts signalés</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.posts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Commentaires signalés</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.comments.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'posts'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Posts signalés ({reports.posts.length})
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'comments'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Commentaires signalés ({reports.comments.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'posts' ? (
                <div className="space-y-6">
                  {reports.posts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Aucun post signalé</p>
                      <p className="text-sm">Tout va bien !</p>
                    </div>
                  ) : (
                    reports.posts.map((post) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center">
                                <UserIcon className="w-4 h-4 mr-1" />
                                {post.author?.name}
                              </span>
                              <span className="flex items-center">
                                <ClockIcon className="w-4 h-4 mr-1" />
                                {formatDate(post.createdAt)}
                              </span>
                              <span className="flex items-center">
                                <EyeIcon className="w-4 h-4 mr-1" />
                                {post.views} vues
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleDeleteContent('post', post._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Supprimer le post"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Signalements */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                            Signalements ({post.reports.length})
                          </h4>
                          <div className="space-y-3">
                            {post.reports.map((report, index) => (
                              <div key={index} className="bg-white rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                      {report.user?.name}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      report.status === 'pending' 
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : report.status === 'reviewed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {report.status === 'pending' ? 'En attente' : 
                                       report.status === 'reviewed' ? 'Examiné' : 'Rejeté'}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {formatDate(report.createdAt)}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-700">
                                  <span className="font-medium">Raison:</span> {getReasonLabel(report.reason)}
                                </div>
                                {report.description && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Description:</span> {report.description}
                                  </div>
                                )}
                                
                                {report.status === 'pending' && (
                                  <div className="flex gap-2 mt-3">
                                    <button
                                      onClick={() => handleReportAction('post', post._id, 'reviewed')}
                                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-lg hover:bg-green-200 flex items-center"
                                    >
                                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                                      Examiner
                                    </button>
                                    <button
                                      onClick={() => handleReportAction('post', post._id, 'dismissed')}
                                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg hover:bg-gray-200 flex items-center"
                                    >
                                      <XMarkIcon className="w-4 h-4 mr-1" />
                                      Rejeter
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {reports.comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Aucun commentaire signalé</p>
                      <p className="text-sm">Tout va bien !</p>
                    </div>
                  ) : (
                    reports.comments.map((comment) => (
                      <motion.div
                        key={comment._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="text-gray-800 mb-3">
                              {comment.content}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <UserIcon className="w-4 h-4 mr-1" />
                                {comment.author?.name}
                              </span>
                              <span className="flex items-center">
                                <ClockIcon className="w-4 h-4 mr-1" />
                                {formatDate(comment.createdAt)}
                              </span>
                              <span className="text-sm">
                                Post: {comment.post?.title}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleDeleteContent('comment', comment._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Supprimer le commentaire"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Signalements */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                            Signalements ({comment.reports.length})
                          </h4>
                          <div className="space-y-3">
                            {comment.reports.map((report, index) => (
                              <div key={index} className="bg-white rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                      {report.user?.name}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      report.status === 'pending' 
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : report.status === 'reviewed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {report.status === 'pending' ? 'En attente' : 
                                       report.status === 'reviewed' ? 'Examiné' : 'Rejeté'}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {formatDate(report.createdAt)}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-700">
                                  <span className="font-medium">Raison:</span> {getReasonLabel(report.reason)}
                                </div>
                                {report.description && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Description:</span> {report.description}
                                  </div>
                                )}
                                
                                {report.status === 'pending' && (
                                  <div className="flex gap-2 mt-3">
                                    <button
                                      onClick={() => handleReportAction('comment', comment._id, 'reviewed')}
                                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-lg hover:bg-green-200 flex items-center"
                                    >
                                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                                      Examiner
                                    </button>
                                    <button
                                      onClick={() => handleReportAction('comment', comment._id, 'dismissed')}
                                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg hover:bg-gray-200 flex items-center"
                                    >
                                      <XMarkIcon className="w-4 h-4 mr-1" />
                                      Rejeter
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ForumAdminPage;
