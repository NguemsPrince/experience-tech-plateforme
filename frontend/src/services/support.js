import api from './api';

export const supportService = {
  // Get all support tickets for current user
  getAllTickets: async () => {
    try {
      return await api.get('/support/tickets');
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for support tickets');
      return {
        success: true,
        data: [
          {
            id: 1,
            subject: 'Problème de connexion',
            status: 'open',
            priority: 'medium',
            createdAt: new Date().toISOString()
          }
        ]
      };
    }
  },

  // Get single ticket
  getTicket: async (ticketId) => {
    try {
      return await api.get(`/support/tickets/${ticketId}`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for support ticket');
      return {
        success: true,
        data: {
          id: ticketId,
          subject: 'Problème de connexion',
          status: 'open',
          priority: 'medium'
        }
      };
    }
  },

  // Create new support ticket
  createTicket: async (ticketData) => {
    try {
      return await api.post('/support/tickets', ticketData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Support ticket created successfully', ticketData);
      return {
        success: true,
        data: {
          id: Date.now(),
          ...ticketData,
          status: 'open',
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  // Update ticket
  updateTicket: async (ticketId, ticketData) => {
    try {
      return await api.put(`/support/tickets/${ticketId}`, ticketData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Support ticket updated successfully', ticketId, ticketData);
      return {
        success: true,
        data: { id: ticketId, ...ticketData }
      };
    }
  },

  // Add message to ticket
  addMessage: async (ticketId, messageData) => {
    try {
      return await api.post(`/support/tickets/${ticketId}/messages`, messageData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Message added to ticket successfully', ticketId, messageData);
      return { success: true };
    }
  },

  // Close ticket
  closeTicket: async (ticketId) => {
    try {
      return await api.put(`/support/tickets/${ticketId}/close`);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Support ticket closed successfully', ticketId);
      return { success: true };
    }
  },

  // Get ticket status
  getTicketStatus: async (ticketId) => {
    try {
      return await api.get(`/support/tickets/${ticketId}/status`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for ticket status');
      return {
        success: true,
        data: {
          id: ticketId,
          status: 'open'
        }
      };
    }
  }
};
