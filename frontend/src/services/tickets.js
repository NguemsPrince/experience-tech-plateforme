import api from './api';

// Service pour la gestion des tickets
export const ticketService = {
  // Créer un nouveau ticket
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtenir tous les tickets avec filtres
  getTickets: async (params = {}) => {
    try {
      const response = await api.get('/tickets', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtenir un ticket par ID
  getTicket: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un ticket
  updateTicket: async (ticketId, updateData) => {
    try {
      const response = await api.put(`/tickets/${ticketId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un ticket (admin seulement)
  deleteTicket: async (ticketId) => {
    try {
      const response = await api.delete(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtenir les statistiques des tickets
  getTicketStats: async () => {
    try {
      const response = await api.get('/tickets/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Ajouter un commentaire
  addComment: async (ticketId, commentData) => {
    try {
      const response = await api.post(`/tickets/${ticketId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtenir les commentaires d'un ticket
  getComments: async (ticketId, params = {}) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/comments`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un commentaire
  updateComment: async (ticketId, commentId, updateData) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/comments/${commentId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un commentaire
  deleteComment: async (ticketId, commentId) => {
    try {
      const response = await api.delete(`/tickets/${ticketId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Constantes pour les tickets
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  PENDING_CUSTOMER: 'pending_customer',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const TICKET_CATEGORY = {
  TECHNICAL: 'technical',
  BILLING: 'billing',
  TRAINING: 'training',
  SERVICE: 'service',
  BUG_REPORT: 'bug_report',
  FEATURE_REQUEST: 'feature_request',
  GENERAL: 'general'
};

// Labels en français
export const TICKET_LABELS = {
  status: {
    [TICKET_STATUS.OPEN]: 'Ouvert',
    [TICKET_STATUS.IN_PROGRESS]: 'En cours',
    [TICKET_STATUS.PENDING_CUSTOMER]: 'En attente client',
    [TICKET_STATUS.RESOLVED]: 'Résolu',
    [TICKET_STATUS.CLOSED]: 'Fermé'
  },
  priority: {
    [TICKET_PRIORITY.LOW]: 'Faible',
    [TICKET_PRIORITY.MEDIUM]: 'Moyenne',
    [TICKET_PRIORITY.HIGH]: 'Élevée',
    [TICKET_PRIORITY.URGENT]: 'Urgente'
  },
  category: {
    [TICKET_CATEGORY.TECHNICAL]: 'Technique',
    [TICKET_CATEGORY.BILLING]: 'Facturation',
    [TICKET_CATEGORY.TRAINING]: 'Formation',
    [TICKET_CATEGORY.SERVICE]: 'Service client',
    [TICKET_CATEGORY.BUG_REPORT]: 'Signalement de bug',
    [TICKET_CATEGORY.FEATURE_REQUEST]: 'Demande de fonctionnalité',
    [TICKET_CATEGORY.GENERAL]: 'Général'
  }
};

// Couleurs pour les statuts et priorités
export const TICKET_COLORS = {
  status: {
    [TICKET_STATUS.OPEN]: 'bg-blue-100 text-blue-800',
    [TICKET_STATUS.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [TICKET_STATUS.PENDING_CUSTOMER]: 'bg-orange-100 text-orange-800',
    [TICKET_STATUS.RESOLVED]: 'bg-green-100 text-green-800',
    [TICKET_STATUS.CLOSED]: 'bg-gray-100 text-gray-800'
  },
  priority: {
    [TICKET_PRIORITY.LOW]: 'bg-gray-100 text-gray-800',
    [TICKET_PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-800',
    [TICKET_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
    [TICKET_PRIORITY.URGENT]: 'bg-red-100 text-red-800'
  }
};

export default ticketService;
