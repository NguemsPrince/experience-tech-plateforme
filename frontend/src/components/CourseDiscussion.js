import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  ClockIcon,
  HandThumbUpIcon,
  ArrowUturnLeftIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as ThumbUpSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const CourseDiscussion = ({ courseId }) => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    type: 'general'
  });
  const [replies, setReplies] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [newReply, setNewReply] = useState({});

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      // Mock data for now
      setDiscussions([
        {
          _id: 1,
          title: "Question sur les hooks React",
          content: "Bonjour, j'ai du mal à comprendre la différence entre useEffect et useState. Quelqu'un peut m'expliquer ?",
          author: {
            name: "Marie Claire",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3"
          },
          type: "question",
          likes: 12,
          replies: 5,
          createdAt: "2024-01-15T10:30:00Z",
          isLiked: false,
          isResolved: false,
          lessonId: null,
          repliesList: [
            {
              _id: 1,
              content: "useState gère l'état local d'un composant, tandis que useEffect gère les effets de bord...",
              author: {
                name: "Jean Paul",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3"
              },
              createdAt: "2024-01-15T11:00:00Z",
              isInstructor: true,
              likes: 8
            }
          ]
        },
        {
          _id: 2,
          title: "Problème avec l'installation de Node.js",
          content: "Je n'arrive pas à installer Node.js sur mon Mac. J'obtiens une erreur de permissions.",
          author: {
            name: "Paul Biya",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
          },
          type: "technical",
          likes: 7,
          replies: 3,
          createdAt: "2024-01-14T14:20:00Z",
          isLiked: true,
          isResolved: true,
          lessonId: 1,
          repliesList: []
        }
      ]);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    try {
      const discussion = {
        ...newDiscussion,
        author: {
          name: user?.name || "Utilisateur",
          avatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
        },
        likes: 0,
        replies: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
        isResolved: false,
        repliesList: []
      };

      setDiscussions([discussion, ...discussions]);
      setNewDiscussion({ title: '', content: '', type: 'general' });
      setShowNewDiscussion(false);
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleLikeDiscussion = (discussionId) => {
    setDiscussions(discussions.map(discussion => {
      if (discussion._id === discussionId) {
        return {
          ...discussion,
          isLiked: !discussion.isLiked,
          likes: discussion.isLiked ? discussion.likes - 1 : discussion.likes + 1
        };
      }
      return discussion;
    }));
  };

  const handleAddReply = async (discussionId, e) => {
    e.preventDefault();
    const replyContent = newReply[discussionId];
    if (!replyContent) return;

    try {
      const reply = {
        _id: Date.now(),
        content: replyContent,
        author: {
          name: user?.name || "Utilisateur",
          avatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
        },
        createdAt: new Date().toISOString(),
        isInstructor: false,
        likes: 0
      };

      setDiscussions(discussions.map(discussion => {
        if (discussion._id === discussionId) {
          return {
            ...discussion,
            replies: discussion.replies + 1,
            repliesList: [...discussion.repliesList, reply]
          };
        }
        return discussion;
      }));

      setNewReply({ ...newReply, [discussionId]: '' });
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const toggleReplies = (discussionId) => {
    setShowReplies({
      ...showReplies,
      [discussionId]: !showReplies[discussionId]
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'question':
        return 'bg-blue-100 text-blue-800';
      case 'technical':
        return 'bg-red-100 text-red-800';
      case 'general':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'question':
        return 'Question';
      case 'technical':
        return 'Problème technique';
      case 'general':
        return 'Discussion générale';
      default:
        return 'Autre';
    }
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = !searchTerm || 
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || discussion.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

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
          <h3 className="text-xl font-bold text-gray-900">Discussions du cours</h3>
          <p className="text-gray-600">Posez vos questions et échangez avec la communauté</p>
        </div>
        <button
          onClick={() => setShowNewDiscussion(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Nouvelle discussion</span>
        </button>
      </div>

      {/* New Discussion Modal */}
      {showNewDiscussion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h4 className="text-lg font-bold mb-4">Créer une nouvelle discussion</h4>
            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Résumez votre question ou discussion"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newDiscussion.type}
                  onChange={(e) => setNewDiscussion({...newDiscussion, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="question">Question</option>
                  <option value="technical">Problème technique</option>
                  <option value="general">Discussion générale</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu
                </label>
                <textarea
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez votre question ou le sujet de discussion..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewDiscussion(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans les discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les types</option>
          <option value="question">Questions</option>
          <option value="technical">Problèmes techniques</option>
          <option value="general">Discussions générales</option>
        </select>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <div key={discussion._id} className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Discussion Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <img
                  src={discussion.author.avatar}
                  alt={discussion.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{discussion.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Par {discussion.author.name}</span>
                    <span>•</span>
                    <span>{formatDate(discussion.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(discussion.type)}`}>
                  {getTypeLabel(discussion.type)}
                </span>
                {discussion.isResolved && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Résolu
                  </span>
                )}
              </div>
            </div>

            {/* Discussion Content */}
            <p className="text-gray-700 mb-4">{discussion.content}</p>

            {/* Discussion Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLikeDiscussion(discussion._id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    discussion.isLiked 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {discussion.isLiked ? (
                    <ThumbUpSolidIcon className="w-4 h-4" />
                  ) : (
                    <HandThumbUpIcon className="w-4 h-4" />
                  )}
                  <span>{discussion.likes}</span>
                </button>
                
                <button
                  onClick={() => toggleReplies(discussion._id)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <ArrowUturnLeftIcon className="w-4 h-4" />
                  <span>{discussion.replies} réponses</span>
                </button>
              </div>

              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <FlagIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Replies */}
            {showReplies[discussion._id] && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                {/* Existing Replies */}
                {discussion.repliesList.map((reply) => (
                  <div key={reply._id} className="flex items-start space-x-3 mb-4">
                    <img
                      src={reply.author.avatar}
                      alt={reply.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{reply.author.name}</span>
                        {reply.isInstructor && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Instructeur
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{reply.content}</p>
                    </div>
                  </div>
                ))}

                {/* Add Reply Form */}
                <form onSubmit={(e) => handleAddReply(discussion._id, e)} className="flex items-start space-x-3">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"}
                    alt="Votre avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newReply[discussion._id] || ''}
                      onChange={(e) => setNewReply({...newReply, [discussion._id]: e.target.value})}
                      placeholder="Ajouter une réponse..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Répondre
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDiscussions.length === 0 && (
        <div className="text-center py-12">
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune discussion trouvée
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' 
              ? "Aucune discussion ne correspond à vos critères de recherche."
              : "Soyez le premier à démarrer une discussion !"
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={() => setShowNewDiscussion(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer une discussion
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDiscussion;
