const axios = require('axios');
const Ticket = require('../models/Ticket');
const TicketComment = require('../models/TicketComment');
const User = require('../models/User');

class FreshdeskService {
  constructor() {
    this.apiKey = process.env.FRESHDESK_API_KEY;
    this.domain = process.env.FRESHDESK_DOMAIN;
    this.baseURL = `https://${this.domain}.freshdesk.com/api/v2`;
    
    if (!this.apiKey || !this.domain) {
      console.warn('Freshdesk credentials not configured. Integration disabled.');
      this.enabled = false;
    } else {
      this.enabled = true;
    }
  }

  // Configuration de l'API Freshdesk
  getApiConfig() {
    return {
      baseURL: this.baseURL,
      auth: {
        username: this.apiKey,
        password: 'X'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  // Créer un ticket dans Freshdesk
  async createTicket(ticketData) {
    if (!this.enabled) {
      throw new Error('Freshdesk integration not enabled');
    }

    try {
      const freshdeskData = {
        subject: ticketData.subject,
        description: ticketData.description,
        email: ticketData.contactEmail,
        phone: ticketData.contactPhone,
        priority: this.mapPriorityToFreshdesk(ticketData.priority),
        status: this.mapStatusToFreshdesk(ticketData.status),
        tags: ticketData.tags || [],
        custom_fields: {
          cf_ticket_number: ticketData.ticketNumber,
          cf_category: ticketData.category,
          cf_source: 'web_platform'
        }
      };

      const response = await axios.post('/tickets', freshdeskData, this.getApiConfig());
      
      return {
        freshdeskId: response.data.id,
        freshdeskUrl: `https://${this.domain}.freshdesk.com/a/tickets/${response.data.id}`
      };
    } catch (error) {
      console.error('Error creating Freshdesk ticket:', error.response?.data || error.message);
      throw error;
    }
  }

  // Mettre à jour un ticket dans Freshdesk
  async updateTicket(freshdeskId, updateData) {
    if (!this.enabled) {
      throw new Error('Freshdesk integration not enabled');
    }

    try {
      const freshdeskData = {};
      
      if (updateData.subject) freshdeskData.subject = updateData.subject;
      if (updateData.description) freshdeskData.description = updateData.description;
      if (updateData.priority) freshdeskData.priority = this.mapPriorityToFreshdesk(updateData.priority);
      if (updateData.status) freshdeskData.status = this.mapStatusToFreshdesk(updateData.status);
      if (updateData.tags) freshdeskData.tags = updateData.tags;

      const response = await axios.put(`/tickets/${freshdeskId}`, freshdeskData, this.getApiConfig());
      return response.data;
    } catch (error) {
      console.error('Error updating Freshdesk ticket:', error.response?.data || error.message);
      throw error;
    }
  }

  // Ajouter un commentaire dans Freshdesk
  async addComment(freshdeskId, commentData) {
    if (!this.enabled) {
      throw new Error('Freshdesk integration not enabled');
    }

    try {
      const freshdeskData = {
        body: commentData.content,
        public: commentData.isPublic !== false
      };

      const response = await axios.post(`/tickets/${freshdeskId}/notes`, freshdeskData, this.getApiConfig());
      return response.data;
    } catch (error) {
      console.error('Error adding Freshdesk comment:', error.response?.data || error.message);
      throw error;
    }
  }

  // Synchroniser un ticket depuis Freshdesk
  async syncTicketFromFreshdesk(freshdeskId) {
    if (!this.enabled) {
      throw new Error('Freshdesk integration not enabled');
    }

    try {
      const response = await axios.get(`/tickets/${freshdeskId}`, this.getApiConfig());
      const freshdeskTicket = response.data;

      // Trouver le ticket local
      const localTicket = await Ticket.findOne({ freshdeskId: freshdeskId });
      if (!localTicket) {
        console.warn(`Local ticket not found for Freshdesk ID: ${freshdeskId}`);
        return null;
      }

      // Mettre à jour le ticket local
      localTicket.subject = freshdeskTicket.subject;
      localTicket.description = freshdeskTicket.description;
      localTicket.priority = this.mapPriorityFromFreshdesk(freshdeskTicket.priority);
      localTicket.status = this.mapStatusFromFreshdesk(freshdeskTicket.status);
      localTicket.tags = freshdeskTicket.tags || [];

      await localTicket.save();

      return localTicket;
    } catch (error) {
      console.error('Error syncing ticket from Freshdesk:', error.response?.data || error.message);
      throw error;
    }
  }

  // Synchroniser les commentaires depuis Freshdesk
  async syncCommentsFromFreshdesk(freshdeskId) {
    if (!this.enabled) {
      throw new Error('Freshdesk integration not enabled');
    }

    try {
      const response = await axios.get(`/tickets/${freshdeskId}/conversations`, this.getApiConfig());
      const conversations = response.data;

      const localTicket = await Ticket.findOne({ freshdeskId: freshdeskId });
      if (!localTicket) {
        console.warn(`Local ticket not found for Freshdesk ID: ${freshdeskId}`);
        return [];
      }

      const syncedComments = [];

      for (const conversation of conversations) {
        // Vérifier si le commentaire existe déjà
        const existingComment = await TicketComment.findOne({ 
          freshdeskId: conversation.id 
        });

        if (!existingComment) {
          // Créer un nouveau commentaire
          const comment = await TicketComment.create({
            ticket: localTicket._id,
            author: localTicket.user, // Utiliser l'utilisateur du ticket par défaut
            content: conversation.body_text,
            type: conversation.incoming ? 'comment' : 'note',
            isPublic: conversation.private === false,
            freshdeskId: conversation.id
          });

          syncedComments.push(comment);
        }
      }

      return syncedComments;
    } catch (error) {
      console.error('Error syncing comments from Freshdesk:', error.response?.data || error.message);
      throw error;
    }
  }

  // Mapper les priorités vers Freshdesk
  mapPriorityToFreshdesk(priority) {
    const mapping = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'urgent': 4
    };
    return mapping[priority] || 2;
  }

  // Mapper les priorités depuis Freshdesk
  mapPriorityFromFreshdesk(priority) {
    const mapping = {
      1: 'low',
      2: 'medium',
      3: 'high',
      4: 'urgent'
    };
    return mapping[priority] || 'medium';
  }

  // Mapper les statuts vers Freshdesk
  mapStatusToFreshdesk(status) {
    const mapping = {
      'open': 2,
      'in_progress': 3,
      'pending_customer': 4,
      'resolved': 5,
      'closed': 6
    };
    return mapping[status] || 2;
  }

  // Mapper les statuts depuis Freshdesk
  mapStatusFromFreshdesk(status) {
    const mapping = {
      2: 'open',
      3: 'in_progress',
      4: 'pending_customer',
      5: 'resolved',
      6: 'closed'
    };
    return mapping[status] || 'open';
  }

  // Synchroniser tous les tickets (pour les tâches périodiques)
  async syncAllTickets() {
    if (!this.enabled) {
      console.log('Freshdesk integration not enabled, skipping sync');
      return;
    }

    try {
      const tickets = await Ticket.find({ 
        freshdeskId: { $exists: true },
        status: { $nin: ['closed'] }
      });

      console.log(`Syncing ${tickets.length} tickets with Freshdesk...`);

      for (const ticket of tickets) {
        try {
          await this.syncTicketFromFreshdesk(ticket.freshdeskId);
          await this.syncCommentsFromFreshdesk(ticket.freshdeskId);
          console.log(`Synced ticket ${ticket.ticketNumber}`);
        } catch (error) {
          console.error(`Error syncing ticket ${ticket.ticketNumber}:`, error.message);
        }
      }

      console.log('Freshdesk sync completed');
    } catch (error) {
      console.error('Error during Freshdesk sync:', error.message);
    }
  }

  // Obtenir les statistiques Freshdesk
  async getFreshdeskStats() {
    if (!this.enabled) {
      throw new Error('Freshdesk integration not enabled');
    }

    try {
      const response = await axios.get('/tickets', {
        ...this.getApiConfig(),
        params: {
          per_page: 1,
          page: 1
        }
      });

      return {
        totalTickets: response.headers['x-total-count'] || 0,
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting Freshdesk stats:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new FreshdeskService();
