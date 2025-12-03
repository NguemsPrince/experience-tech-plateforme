import React, { useState, useEffect, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
  XMarkIcon,
  EyeIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';

const SupportManagement = ({ darkMode = false }) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketComments, setTicketComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        search: searchQuery || undefined,
      };
      Object.keys(params).forEach((key) => params[key] === '' && delete params[key]);

      const response = await adminService.getTickets(params);
      
      // Le backend peut retourner différents formats
      if (response && response.data) {
        const ticketsList = Array.isArray(response.data) 
          ? response.data 
          : (response.data.tickets || []);
        setTickets(ticketsList);
        setFilteredTickets(ticketsList);
      } else if (response && Array.isArray(response)) {
        setTickets(response);
        setFilteredTickets(response);
      } else if (response && response.tickets) {
        // Format alternatif avec tickets directement
        setTickets(response.tickets);
        setFilteredTickets(response.tickets);
      } else {
        setTickets([]);
        setFilteredTickets([]);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Erreur lors du chargement des tickets');
      setTickets([]);
      setFilteredTickets([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleViewTicket = async (ticketId) => {
    try {
      const response = await adminService.getTicket(ticketId);
      const ticket = response.data || response;
      setSelectedTicket(ticket);
      setShowTicketModal(true);
      
      // Load comments
      try {
        const commentsResponse = await adminService.getTicketComments(ticketId);
        const comments = commentsResponse.data || commentsResponse.comments || [];
        setTicketComments(comments);
      } catch (error) {
        console.error('Error loading comments:', error);
        setTicketComments([]);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement du ticket';
      toast.error(errorMessage);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !selectedTicket) return;
    
    setIsSubmittingComment(true);
    try {
      const ticketId = selectedTicket._id || selectedTicket.id;
      await adminService.addTicketComment(ticketId, newComment.trim(), 'comment');
      toast.success('Réponse envoyée avec succès');
      setNewComment('');
      
      // Reload comments
      const commentsResponse = await adminService.getTicketComments(ticketId);
      const comments = commentsResponse.data || commentsResponse.comments || [];
      setTicketComments(comments);
      
      // Reload ticket to update status if needed
      await loadTickets();
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Erreur lors de l\'envoi de la réponse');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await adminService.updateTicket(ticketId, { status: newStatus });
      toast.success('Statut du ticket mis à jour');
      await loadTickets();
      if (selectedTicket && (selectedTicket._id === ticketId || selectedTicket.id === ticketId)) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du ticket';
      toast.error(errorMessage);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
    });
    setSearchQuery('');
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      pending_customer: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Ouvert',
      in_progress: 'En cours',
      pending_customer: 'En attente client',
      resolved: 'Résolu',
      closed: 'Fermé',
    };
    return labels[status] || status;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return badges[priority] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: 'Faible',
      medium: 'Moyenne',
      high: 'Élevée',
      urgent: 'Urgent',
    };
    return labels[priority] || priority;
  };

  if (loading && tickets.length === 0) {
    return <LoadingSpinner size="large" text="Chargement des tickets..." />;
  }

  return (
    <div className={`space-y-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion du Support</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez les tickets de support et les demandes clients
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="pending_customer">En attente client</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Toutes les priorités</option>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
            <option value="urgent">Urgent</option>
          </select>

          {/* Clear Filters */}
          {(filters.status || filters.priority || filters.category || searchQuery) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 justify-center"
            >
              <XMarkIcon className="w-5 h-5" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Aucun ticket trouvé
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const ticketId = ticket._id || ticket.id;
                  return (
                    <tr key={ticketId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {ticket.ticketNumber || ticketId}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {ticket.subject}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {ticket.contactEmail || ticket.user?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(ticket.priority)}`}>
                          {getPriorityLabel(ticket.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(ticket.status)}`}>
                          {getStatusLabel(ticket.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewTicket(ticketId)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Détails du ticket</h3>
              <button
                onClick={() => {
                  setShowTicketModal(false);
                  setSelectedTicket(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sujet</label>
                <p className="text-gray-900 dark:text-white">{selectedTicket.subject}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <p className="text-gray-900 dark:text-white">{selectedTicket.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select
                    value={selectedTicket.status || 'open'}
                    onChange={(e) => handleUpdateStatus(selectedTicket._id || selectedTicket.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="open">Ouvert</option>
                    <option value="in_progress">En cours</option>
                    <option value="pending_customer">En attente client</option>
                    <option value="resolved">Résolu</option>
                    <option value="closed">Fermé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priorité</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(selectedTicket.priority)}`}>
                    {getPriorityLabel(selectedTicket.priority)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <p className="text-gray-900 dark:text-white">{selectedTicket.contactEmail || selectedTicket.user?.email || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date de création</label>
                <p className="text-gray-900 dark:text-white">
                  {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString('fr-FR') : 'N/A'}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Conversation</h4>
              
              {/* Comments List */}
              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                {ticketComments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Aucun commentaire</p>
                ) : (
                  ticketComments.map((comment) => (
                    <div key={comment._id || comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {comment.author?.firstName || comment.author?.email || 'Admin'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleString('fr-FR') : ''}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Répondre au ticket
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tapez votre réponse..."
                    rows={3}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                    {isSubmittingComment ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportManagement;

