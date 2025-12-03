import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ticketService, TICKET_LABELS, TICKET_COLORS } from '../services/tickets';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-hot-toast';

const TicketDetail = ({ ticketId, onBack, onUpdate }) => {
  const { t } = useTranslation();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({});

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const [ticketResponse, commentsResponse] = await Promise.all([
        ticketService.getTicket(ticketId),
        ticketService.getComments(ticketId)
      ]);
      
      setTicket(ticketResponse.data.ticket);
      setComments(commentsResponse.data.comments);
      setUpdateData({
        status: ticketResponse.data.ticket.status,
        priority: ticketResponse.data.ticket.priority,
        assignedTo: ticketResponse.data.ticket.assignedTo?._id || ''
      });
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      toast.error('Erreur lors du chargement du ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await ticketService.addComment(ticketId, {
        content: newComment,
        type: 'comment',
        isPublic: true
      });
      
      setComments(prev => [...prev, response.data]);
      setNewComment('');
      toast.success('Commentaire ajouté avec succès');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await ticketService.updateTicket(ticketId, updateData);
      setTicket(response.data);
      setShowUpdateForm(false);
      toast.success('Ticket mis à jour avec succès');
      if (onUpdate) onUpdate(response.data);
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Erreur lors de la mise à jour du ticket');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    const icons = {
      open: '🔵',
      in_progress: '🟡',
      pending_customer: '🟠',
      resolved: '🟢',
      closed: '⚫'
    };
    return icons[status] || '🔵';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Ticket non trouvé</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon(ticket.status)}</span>
          <span className="text-sm text-gray-500">#{ticket.ticketNumber}</span>
        </div>
      </div>

      {/* Informations du ticket */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
          <div className="text-sm text-gray-500">
            Créé le {formatDate(ticket.createdAt)}
          </div>
        </div>

        {/* Métadonnées */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TICKET_COLORS.status[ticket.status]}`}>
            {TICKET_LABELS.status[ticket.status]}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TICKET_COLORS.priority[ticket.priority]}`}>
            {TICKET_LABELS.priority[ticket.priority]}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {TICKET_LABELS.category[ticket.category]}
          </span>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>
        </div>

        {/* Informations de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Email de contact</h4>
            <p className="text-sm text-gray-600">{ticket.contactEmail}</p>
          </div>
          {ticket.contactPhone && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Téléphone</h4>
              <p className="text-sm text-gray-600">{ticket.contactPhone}</p>
            </div>
          )}
        </div>

        {/* Assignation */}
        {ticket.assignedTo && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Assigné à</h4>
            <p className="text-sm text-gray-600">
              {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
            </p>
          </div>
        )}

        {/* Tags */}
        {ticket.tags && ticket.tags.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {ticket.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bouton de mise à jour */}
        <button
          onClick={() => setShowUpdateForm(!showUpdateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showUpdateForm ? 'Annuler' : 'Mettre à jour'}
        </button>
      </div>

      {/* Formulaire de mise à jour */}
      {showUpdateForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mettre à jour le ticket</h3>
          <form onSubmit={handleUpdateTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(TICKET_LABELS.status).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priorité
                </label>
                <select
                  value={updateData.priority}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(TICKET_LABELS.priority).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowUpdateForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Commentaires */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commentaires</h3>
        
        {/* Liste des commentaires */}
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-l-4 border-blue-200 pl-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {comment.author.firstName} {comment.author.lastName}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({comment.author.role})
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
              {comment.isEdited && (
                <p className="text-xs text-gray-500 mt-1">
                  Modifié le {formatDate(comment.editedAt)}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Formulaire de nouveau commentaire */}
        <form onSubmit={handleAddComment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ajouter un commentaire
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tapez votre commentaire..."
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={commentLoading || !newComment.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {commentLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Ajout...
                </div>
              ) : (
                'Ajouter le commentaire'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;
