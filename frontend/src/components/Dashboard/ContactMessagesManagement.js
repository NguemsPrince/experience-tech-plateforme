import React, { useState, useEffect } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  ArchiveBoxIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'react-hot-toast';

const ContactMessagesManagement = ({ darkMode = false }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    loadMessages();
  }, [filters, pagination.page]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      // Nettoyer les paramètres vides
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await adminService.getContactMessages(params);
      
      // Gérer différents formats de réponse
      let contactMessages = [];
      let paginationData = {};
      
      if (response) {
        // Structure standard avec success et data : { success: true, data: { contactMessages: [], pagination: {} } }
        if (response.success && response.data) {
          if (response.data.contactMessages) {
            contactMessages = Array.isArray(response.data.contactMessages) ? response.data.contactMessages : [];
            paginationData = response.data.pagination || {};
          } else if (Array.isArray(response.data)) {
            // Si data est directement un array
            contactMessages = response.data;
          }
        }
        // Structure directe : { contactMessages: [], pagination: {} }
        else if (response.contactMessages) {
          contactMessages = Array.isArray(response.contactMessages) ? response.contactMessages : [];
          paginationData = response.pagination || {};
        }
        // Si directement un array (ancien format)
        else if (Array.isArray(response)) {
          contactMessages = response;
        }
        // Si c'est un objet avec un tableau dedans
        else if (response.data && Array.isArray(response.data)) {
          contactMessages = response.data;
        }
      }
      
      setMessages(contactMessages);
      setPagination(prev => ({
        ...prev,
        total: paginationData.total || contactMessages.length,
        totalPages: paginationData.totalPages || 1,
      }));
    } catch (error) {
      console.error('Error loading contact messages:', error);
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur lors du chargement des messages';
      
      // Vérifier si c'est une erreur réseau
      const isNetworkError = !error.response && (
        error.code === 'ECONNREFUSED' ||
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Network Error') ||
        error.message?.includes('Failed to fetch')
      );
      
      if (isNetworkError) {
        errorMessage = 'Le serveur backend n\'est pas accessible. Vérifiez qu\'il est démarré sur http://localhost:5000';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      } else if (error.response?.status === 404) {
        // 404 n'est pas une erreur critique - juste aucune donnée
        errorMessage = null;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Afficher l'erreur seulement pour les erreurs critiques
      if (errorMessage && (isNetworkError || error.response?.status >= 500)) {
        toast.error(errorMessage);
      } else if (errorMessage) {
        // Pour les autres erreurs non-critiques, juste logger
        console.warn('Non-critical error loading messages:', errorMessage);
      }
      
      // En cas d'erreur, initialiser avec une liste vide
      setMessages([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 1,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await adminService.updateContactMessage(id, { status: newStatus });
      toast.success('Statut mis à jour avec succès');
      loadMessages();
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      read: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      resolved: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[status] || colors.new;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'replied':
      case 'resolved':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'read':
        return <EyeIcon className="w-5 h-5" />;
      case 'archived':
        return <ArchiveBoxIcon className="w-5 h-5" />;
      default:
        return <EnvelopeIcon className="w-5 h-5" />;
    }
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" text="Chargement des messages..." />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Messages de contact</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {pagination.total} message{pagination.total > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} space-y-4`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, status: e.target.value }));
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Tous les statuts</option>
              <option value="new">Nouveau</option>
              <option value="read">Lu</option>
              <option value="replied">Répondu</option>
              <option value="resolved">Résolu</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie</label>
            <select
              value={filters.category}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, category: e.target.value }));
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Toutes les catégories</option>
              <option value="general">Général</option>
              <option value="support">Support</option>
              <option value="sales">Ventes</option>
              <option value="partnership">Partenariat</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rechercher</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, search: e.target.value }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                placeholder="Nom, email, sujet..."
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {messages.length === 0 ? (
          <div className="p-12 text-center">
            <EnvelopeIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Aucun message pour le moment
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Expéditeur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sujet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {messages.map((message) => (
                  <tr
                    key={message._id}
                    className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${
                      message.status === 'new' ? darkMode ? 'bg-blue-900/20' : 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium">{message.name}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {message.email}
                        </div>
                        {message.phone && (
                          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {message.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium max-w-xs truncate">{message.subject}</div>
                      <div className={`text-xs mt-1 max-w-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {message.message.substring(0, 100)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {message.categoryDisplay || message.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {getStatusIcon(message.status)}
                        <span className="ml-1">{message.statusDisplay || message.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedMessage(message)}
                        className={`mr-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Page {pagination.page} sur {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Précédent
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page >= pagination.totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMessage && (
        <ContactMessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onUpdate={handleStatusUpdate}
          onReload={loadMessages}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

const ContactMessageDetailModal = ({ message, onClose, onUpdate, onReload, darkMode }) => {
  const [status, setStatus] = useState(message.status);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Veuillez entrer un message de réponse');
      return;
    }

    try {
      setIsReplying(true);
      await adminService.replyToContactMessage(message._id, replyText);
      toast.success('Réponse envoyée avec succès');
      setReplyText('');
      onReload();
      // Refresh message data
      const updated = await adminService.getContactMessage(message._id);
      if (updated.success && updated.data) {
        setStatus(updated.data.status);
      }
    } catch (error) {
      console.error('Error replying:', error);
      toast.error('Erreur lors de l\'envoi de la réponse');
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await adminService.updateContactMessage(message._id, { status: newStatus });
      setStatus(newStatus);
      toast.success('Statut mis à jour');
      onReload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Détails du message</h3>
            <button
              onClick={onClose}
              className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Sender Info */}
          <div>
            <h4 className="font-semibold mb-3">Expéditeur</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-32 font-medium">Nom:</span>
                <span>{message.name}</span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-2 text-gray-400" />
                <span>{message.email}</span>
              </div>
              {message.phone && (
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <span>{message.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Subject & Message */}
          <div>
            <h4 className="font-semibold mb-3">Sujet</h4>
            <p className="text-lg font-medium">{message.subject}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Message</h4>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          {/* Replies */}
          {message.replies && message.replies.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Réponses</h4>
              <div className="space-y-3">
                {message.replies.map((reply, index) => (
                  <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {reply.repliedBy?.firstName} {reply.repliedBy?.lastName}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(reply.repliedAt).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{reply.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply Form */}
          <div>
            <h4 className="font-semibold mb-3">Répondre</h4>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              placeholder="Tapez votre réponse..."
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
            <button
              onClick={handleReply}
              disabled={isReplying || !replyText.trim()}
              className={`mt-2 px-4 py-2 rounded-lg ${
                isReplying || !replyText.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isReplying ? 'Envoi...' : 'Envoyer la réponse'}
            </button>
          </div>

          {/* Status Actions */}
          <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className="font-semibold mb-3">Statut</h4>
            <div className="flex flex-wrap gap-2">
              {['new', 'read', 'replied', 'resolved', 'archived'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    status === s
                      ? 'bg-blue-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {s === 'new' ? 'Nouveau' :
                   s === 'read' ? 'Lu' :
                   s === 'replied' ? 'Répondu' :
                   s === 'resolved' ? 'Résolu' :
                   'Archivé'}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Reçu le:</span>
                <div>{new Date(message.createdAt).toLocaleString('fr-FR')}</div>
              </div>
              {message.readAt && (
                <div>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Lu le:</span>
                  <div>{new Date(message.readAt).toLocaleString('fr-FR')}</div>
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessagesManagement;

