import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { 
  ArrowLeftIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  TagIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ClockIcon,
  BellIcon,
  ArrowUturnLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownEditor from '../components/Forum/MarkdownEditor';
import ReportModal from '../components/Forum/ReportModal';
import forumService from '../services/forumService';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import 'highlight.js/styles/github-dark.css';

const TopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // États
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('post');
  const [isFollowing, setIsFollowing] = useState(false);

  // Charger le post avec useCallback
  const loadPost = useCallback(async () => {
    if (!topicId) return;
    setLoading(true);
    try {
      const response = await api.get(`/forum/posts/${topicId}`);
      setPost(response.data.data);
      
      // Vérifier si l'utilisateur suit ce post
      if (user) {
        try {
          const userResponse = await api.get('/auth/me');
          const followedPosts = userResponse.data.data?.forumSettings?.followedPosts || [];
          setIsFollowing(followedPosts.some(id => id === topicId || id._id === topicId));
        } catch (err) {
          // Ignorer l'erreur, l'utilisateur ne suit peut-être pas
          setIsFollowing(false);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du post:', error);
      toast.error('Erreur lors du chargement du sujet');
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  }, [topicId, navigate, user]);

  // Charger les commentaires avec useCallback
  const loadComments = useCallback(async (page = 1) => {
    if (!topicId) return;
    setCommentsLoading(true);
    try {
      const response = await api.get(`/forum/posts/${topicId}/comments`, {
        params: { page, limit: 20 }
      });
      setComments(response.data.data.comments);
      setTotalPages(response.data.data.pagination.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      toast.error('Erreur lors du chargement des commentaires');
    } finally {
      setCommentsLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    if (topicId) {
      loadPost();
      loadComments();
    }
  }, [topicId, loadPost, loadComments]);

  const handleLikePost = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour liker');
      return;
    }

    try {
      await api.post(`/forum/posts/${topicId}/like`);
      loadPost(); // Recharger le post pour mettre à jour les likes
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast.error('Erreur lors du like');
    }
  };

  const handleDislikePost = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour disliker');
      return;
    }

    try {
      await api.post(`/forum/posts/${topicId}/dislike`);
      loadPost();
    } catch (error) {
      console.error('Erreur lors du dislike:', error);
      toast.error('Erreur lors du dislike');
    }
  };

  const handleReportPost = () => {
    if (!user) {
      toast.error('Vous devez être connecté pour signaler');
      return;
    }
    setReportType('post');
    setShowReportModal(true);
  };

  const handleReportComment = (commentId) => {
    if (!user) {
      toast.error('Vous devez être connecté pour signaler');
      return;
    }
    setReportType('comment');
    setReplyingTo(commentId);
    setShowReportModal(true);
  };

  const handleReportSubmit = async (reportData) => {
    try {
      if (reportType === 'post') {
        await forumService.reportPost(topicId, reportData);
      } else {
        await api.post(`/forum/comments/${replyingTo}/report`, reportData);
      }
      setShowReportModal(false);
      setReplyingTo(null);
      toast.success('Signalement envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      throw error; // Laisse la modale gérer l'affichage de l'erreur
    }
  };

  const handleFollowPost = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour suivre un sujet');
      return;
    }

    try {
      if (isFollowing) {
        await forumService.unfollowPost(topicId);
        setIsFollowing(false);
        toast.success('Vous ne suivez plus ce sujet');
      } else {
        await forumService.followPost(topicId);
        setIsFollowing(true);
        toast.success('Vous suivez maintenant ce sujet');
      }
    } catch (error) {
      console.error('Erreur lors du suivi:', error);
      toast.error('Erreur lors du suivi');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez être connecté pour commenter');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      const commentData = {
        content: newComment.trim(),
        parentComment: replyingTo
      };

      await api.post(`/forum/posts/${topicId}/comments`, commentData);
      toast.success('Commentaire ajouté !');
      setNewComment('');
      setReplyingTo(null);
      setShowCommentForm(false);
      loadComments(1); // Recharger les commentaires
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast.error('Vous devez être connecté pour liker');
      return;
    }

    try {
      await api.post(`/forum/comments/${commentId}/like`);
      loadComments(currentPage); // Recharger les commentaires
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast.error('Erreur lors du like');
    }
  };

  const handleMarkAsSolution = async (commentId) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (post.author._id !== user.id && user.role !== 'admin') {
      toast.error('Seul l\'auteur du sujet peut marquer une réponse comme solution');
      return;
    }

    try {
      await api.post(`/forum/comments/${commentId}/solution`);
      toast.success('Commentaire marqué comme solution !');
      loadComments(currentPage);
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
      toast.error('Erreur lors du marquage');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      await api.delete(`/forum/comments/${commentId}`);
      toast.success('Commentaire supprimé');
      loadComments(currentPage);
      if (editingComment === commentId) {
        setEditingComment(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) {
      toast.error('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      await forumService.updateComment(commentId, { content: editContent });
      toast.success('Commentaire modifié');
      setEditingComment(null);
      setEditContent('');
      loadComments(currentPage);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast.error('Erreur lors de la modification');
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

  const formatRelativeTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
    return formatDate(date);
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Chargement du sujet..." />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sujet non trouvé</h1>
            <button
              onClick={() => navigate('/forum')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retour au forum
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/forum')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Retour au forum
          </button>
        </div>

        {/* Post principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm mb-6"
        >
          {/* En-tête du post */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
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
                
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1" />
                    {post.author?.name}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    {post.views} vues
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                {user && (
                  <button
                    onClick={handleFollowPost}
                    className={`flex items-center gap-1 px-3 py-1 text-sm border rounded-lg transition-colors ${
                      isFollowing
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    title={isFollowing ? 'Ne plus suivre' : 'Suivre ce sujet'}
                  >
                    {isFollowing ? (
                      <BellSolidIcon className="w-4 h-4" />
                    ) : (
                      <BellIcon className="w-4 h-4" />
                    )}
                    {isFollowing ? 'Suivi' : 'Suivre'}
                  </button>
                )}
                <button
                  onClick={handleLikePost}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  title="Like"
                >
                  <HeartIcon className="w-4 h-4 text-gray-400" />
                  {post.likesCount || 0}
                </button>
                <button
                  onClick={handleDislikePost}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  title="Dislike"
                >
                  <HeartIcon className="w-4 h-4 text-gray-400 rotate-180" />
                  {post.dislikesCount || 0}
                </button>
                {user && (
                  <button
                    onClick={handleReportPost}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    title="Signaler"
                  >
                    <FlagIcon className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
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

          {/* Contenu du post */}
          <div className="p-6">
            <div className="prose max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>

        {/* Section commentaires */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 text-blue-600" />
                Commentaires ({comments.length})
              </h2>
              
              {user && !post.isLocked && (
                <button
                  onClick={() => {
                    setShowCommentForm(!showCommentForm);
                    if (!showCommentForm) {
                      // Scroller vers le formulaire après un court délai pour permettre l'animation
                      setTimeout(() => {
                        const formElement = document.getElementById('comment-form');
                        if (formElement) {
                          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          // Focus sur le textarea
                          const textarea = formElement.querySelector('textarea');
                          if (textarea) {
                            setTimeout(() => textarea.focus(), 300);
                          }
                        }
                      }, 100);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {showCommentForm ? 'Annuler' : 'Poster'}
                </button>
              )}
            </div>
          </div>

          {/* Formulaire de commentaire */}
          {showCommentForm && user && !post.isLocked && (
            <motion.div
              id="comment-form"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 border-b border-gray-200 bg-gray-50"
            >
              {replyingTo && (
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <ArrowUturnLeftIcon className="w-4 h-4" />
                  <span>Vous répondez à un commentaire</span>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="ml-auto text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              <form onSubmit={handleSubmitComment}>
                <MarkdownEditor
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partagez votre réponse... Vous pouvez utiliser le Markdown pour formater votre texte."
                  minHeight="200px"
                  maxHeight="400px"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-500">
                    {newComment.length}/2000 caractères
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCommentForm(false);
                        setNewComment('');
                        setReplyingTo(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Publier
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* Liste des commentaires */}
          {commentsLoading ? (
            <div className="p-8 text-center">
              <LoadingSpinner size="medium" text="Chargement des commentaires..." />
            </div>
          ) : comments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Aucun commentaire</p>
              <p className="text-sm">Soyez le premier à répondre !</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 ${comment.isSolution ? 'bg-green-50 border-l-4 border-green-400' : ''} ${
                    comment.parentComment ? 'ml-8 border-l-2 border-gray-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {comment.author?.name || comment.author?.firstName || 'Utilisateur'}
                          {comment.isSolution && (
                            <span className="ml-2 text-green-600 text-sm">
                              ✓ Solution acceptée
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatRelativeTime(comment.createdAt)}
                          {comment.isEdited && (
                            <span className="ml-2 text-gray-400">(modifié)</span>
                          )}
                          {comment.parentComment && (
                            <span className="ml-2 text-blue-600">↳ Réponse</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:text-blue-500"
                        title="Like"
                      >
                        <HeartIcon className="w-4 h-4" />
                        {comment.likesCount || 0}
                      </button>
                      
                      {user && (
                        <>
                          {!post.isLocked && (
                            <button
                              onClick={() => {
                                setReplyingTo(comment._id);
                                setShowCommentForm(true);
                                setTimeout(() => {
                                  const formElement = document.getElementById('comment-form');
                                  if (formElement) {
                                    formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }
                                }, 100);
                              }}
                              className="px-2 py-1 text-sm text-gray-500 hover:text-blue-600"
                              title="Répondre"
                            >
                              <ArrowUturnLeftIcon className="w-4 h-4" />
                            </button>
                          )}
                          
                          {post.author._id === user.id && !comment.isSolution && (
                            <button
                              onClick={() => handleMarkAsSolution(comment._id)}
                              className="px-2 py-1 text-sm text-green-600 hover:text-green-700"
                              title="Marquer comme solution"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                          )}
                          
                          {comment.author._id === user.id && (
                            <>
                              {editingComment === comment._id ? (
                                <>
                                  <button
                                    onClick={() => handleSaveEdit(comment._id)}
                                    className="px-2 py-1 text-sm text-green-600 hover:text-green-700"
                                    title="Sauvegarder"
                                  >
                                    <CheckCircleIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
                                    title="Annuler"
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleEditComment(comment)}
                                  className="px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
                                  title="Modifier"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                          
                          {(comment.author._id === user.id || user.role === 'admin') && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
                              title="Supprimer"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleReportComment(comment._id)}
                            className="px-2 py-1 text-sm text-gray-500 hover:text-blue-600"
                            title="Signaler"
                          >
                            <FlagIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {editingComment === comment._id ? (
                    <div className="mt-3">
                      <MarkdownEditor
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Modifiez votre commentaire..."
                        minHeight="150px"
                        maxHeight="300px"
                      />
                    </div>
                  ) : (
                    <div className="prose max-w-none text-gray-800 leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      >
                        {comment.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* Réponses imbriquées */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-8 border-l-2 border-gray-200 pl-4 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-sm font-medium text-gray-900">
                              {reply.author?.name || reply.author?.firstName || 'Utilisateur'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatRelativeTime(reply.createdAt)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-700">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeHighlight, rehypeRaw]}
                            >
                              {reply.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination des commentaires */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {currentPage} sur {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadComments(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => loadComments(Math.min(totalPages, currentPage + 1))}
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
            setReplyingTo(null);
          }}
          onReport={handleReportSubmit}
          contentType={reportType}
        />
      </div>
    </div>
  );
};

export default TopicPage;
