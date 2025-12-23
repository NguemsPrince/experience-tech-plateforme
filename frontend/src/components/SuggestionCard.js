import React, { useState } from 'react';
import { 
  LightBulbIcon, 
  BugAntIcon, 
  StarIcon, 
  CogIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as ThumbUpSolid, HandThumbDownIcon as ThumbDownSolid } from '@heroicons/react/24/solid';

const SuggestionCard = ({ suggestion, onVote, onComment, userRole = 'user' }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
  const [showComments, setShowComments] = useState(false);

  const suggestionTypes = {
    feature: { icon: LightBulbIcon, color: 'bg-blue-500', label: 'Fonctionnalité' },
    improvement: { icon: StarIcon, color: 'bg-green-500', label: 'Amélioration' },
    bug: { icon: BugAntIcon, color: 'bg-blue-500', label: 'Bug' },
    ui: { icon: CogIcon, color: 'bg-purple-500', label: 'Interface' }
  };

  const statusConfig = {
    pending: { 
      icon: ClockIcon, 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      label: 'En attente' 
    },
    approved: { 
      icon: CheckCircleIcon, 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      label: 'Approuvé' 
    },
    rejected: { 
      icon: XCircleIcon, 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      label: 'Rejeté' 
    },
    in_progress: { 
      icon: CogIcon, 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      label: 'En cours' 
    },
    completed: { 
      icon: CheckCircleIcon, 
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      label: 'Terminé' 
    }
  };

  const priorityConfig = {
    low: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', label: 'Faible' },
    medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Moyenne' },
    high: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', label: 'Élevée' },
    critical: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Critique' }
  };

  const handleVote = async (voteType) => {
    if (isVoting || userVote === voteType) return;
    
    setIsVoting(true);
    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUserVote(voteType);
      onVote && onVote(suggestion.id, voteType);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const typeConfig = suggestionTypes[suggestion.type] || suggestionTypes.feature;
  const status = statusConfig[suggestion.status] || statusConfig.pending;
  const priority = priorityConfig[suggestion.priority] || priorityConfig.medium;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${typeConfig.color}`}>
              <typeConfig.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {suggestion.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  <status.icon className="w-3 h-3 inline mr-1" />
                  {status.label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                  {priority.label}
                </span>
              </div>
            </div>
          </div>
          
          {userRole === 'admin' && (
            <div className="flex space-x-2">
              {suggestion.status === 'pending' && (
                <>
                  <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Approuver">
                    <CheckCircleIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Rejeter">
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </>
              )}
              <button className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Modifier">
                <CogIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {suggestion.description}
        </p>

        {/* Tags */}
        {suggestion.tags && suggestion.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestion.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                <TagIcon className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-1" />
              {suggestion.author}
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {new Date(suggestion.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center">
            <EyeIcon className="w-4 h-4 mr-1" />
            {suggestion.views || 0} vues
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {/* Voting */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className={`p-2 rounded-lg transition-colors ${
                  userVote === 'up'
                    ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {userVote === 'up' ? (
                  <ThumbUpSolid className="w-5 h-5" />
                ) : (
                  <HandThumbUpIcon className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[20px] text-center">
                {suggestion.votes || 0}
              </span>
              <button
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className={`p-2 rounded-lg transition-colors ${
                  userVote === 'down'
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {userVote === 'down' ? (
                  <ThumbDownSolid className="w-5 h-5" />
                ) : (
                  <HandThumbDownIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="text-sm">{suggestion.comments?.length || 0}</span>
            </button>
          </div>

          {/* Category */}
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {suggestion.category}
          </span>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              {suggestion.comments?.length > 0 ? (
                suggestion.comments.map((comment, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucun commentaire pour le moment
                </p>
              )}
              
              {/* Add Comment Form */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Ajouter un commentaire..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      Commenter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionCard;
