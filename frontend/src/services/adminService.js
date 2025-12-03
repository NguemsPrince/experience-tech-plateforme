import apiEnhanced from './apiEnhanced';
import { extractApiData, handleApiError } from '../utils/apiDataExtractor';

const adminService = {
  // Dashboard Statistics
  async getDashboardStats(period = '30days') {
    try {
      // apiEnhanced retourne déjà response.data dans l'intercepteur
      const response = await apiEnhanced.get(`/admin/dashboard/stats?period=${period}`);
      // Extraire les données de manière cohérente
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getDashboardStats');
    }
  },

  // Users Management
  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiEnhanced.get(`/users?${queryParams}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getUsers');
    }
  },

  async getUserStats() {
    try {
      const response = await apiEnhanced.get('/users/stats');
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getUserStats');
    }
  },

  async getUser(userId) {
    try {
      const response = await apiEnhanced.get(`/users/${userId}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getUser');
    }
  },

  async updateUser(userId, data) {
    try {
      const response = await apiEnhanced.put(`/users/${userId}`, data);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'updateUser');
    }
  },

  async suspendUser(userId, isActive) {
    try {
      const response = await apiEnhanced.patch(`/users/${userId}/suspend`, { isActive });
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'suspendUser');
    }
  },

  async deleteUser(userId) {
    try {
      const response = await apiEnhanced.delete(`/users/${userId}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'deleteUser');
    }
  },

  async createUser(data) {
    try {
      const response = await apiEnhanced.post(`/users`, data);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'createUser');
    }
  },

  // Roles Management
  async getRoles() {
    try {
      const response = await apiEnhanced.get('/admin/roles');
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getRoles');
    }
  },

  async getRolePermissions(role) {
    try {
      const response = await apiEnhanced.get(`/admin/roles/${role}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getRolePermissions');
    }
  },

  async getAllPermissions() {
    try {
      const response = await apiEnhanced.get('/admin/roles/permissions/all');
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getAllPermissions');
    }
  },

  async getUsersByRole(role, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiEnhanced.get(`/admin/roles/${role}/users?${queryParams}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getUsersByRole');
    }
  },

  async getRoleStats() {
    try {
      const response = await apiEnhanced.get('/admin/roles/stats');
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getRoleStats');
    }
  },

  // Orders Management
  async getOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiEnhanced.get(`/admin/orders?${queryParams}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getOrders');
    }
  },

  async getOrderStats() {
    try {
      const response = await apiEnhanced.get('/admin/orders/stats');
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getOrderStats');
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiEnhanced.put(`/admin/orders/${orderId}/status`, { status });
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'updateOrderStatus');
    }
  },

  // Export Orders
  async exportOrdersCSV(params = {}) {
    try {
      // Nettoyer les paramètres vides
      const cleanParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          cleanParams[key] = params[key];
        }
      });
      
      const queryParams = new URLSearchParams(cleanParams).toString();
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const url = `${apiUrl}/admin/orders/export/csv${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/csv',
        },
      }).catch((fetchError) => {
        // Gérer les erreurs réseau (backend non accessible)
        if (fetchError.message && fetchError.message.includes('Failed to fetch')) {
          throw new Error('Erreur réseau. Le serveur backend n\'est pas accessible. Vérifiez que le serveur est démarré sur http://localhost:5000');
        }
        throw fetchError;
      });

      // Vérifier si la réponse est OK
      if (!response.ok) {
        // Essayer de lire l'erreur JSON
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Si ce n'est pas du JSON, lire le texte
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch (e2) {
            // Ignorer si on ne peut pas lire l'erreur
          }
        }
        throw new Error(errorMessage);
      }

      // Vérifier le type de contenu
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('text/csv')) {
        // Si ce n'est pas du CSV, essayer de lire comme JSON pour voir l'erreur
        const errorData = await response.json().catch(() => ({ message: 'Réponse inattendue du serveur' }));
        throw new Error(errorData.message || 'Le serveur n\'a pas retourné un fichier CSV');
      }

      const blob = await response.blob();
      
      // Créer le lien de téléchargement
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Récupérer le nom de fichier depuis les headers ou utiliser un nom par défaut
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `commandes_${new Date().toISOString().split('T')[0]}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
      
      return { success: true };
    } catch (error) {
      console.error('Error exporting orders CSV:', error);
      throw error;
    }
  },

  async exportOrdersPDF(params = {}) {
    try {
      // Nettoyer les paramètres vides
      const cleanParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          cleanParams[key] = params[key];
        }
      });
      
      const queryParams = new URLSearchParams(cleanParams).toString();
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const url = `${apiUrl}/admin/orders/export/pdf${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
      }).catch((fetchError) => {
        // Gérer les erreurs réseau (backend non accessible)
        if (fetchError.message && fetchError.message.includes('Failed to fetch')) {
          throw new Error('Erreur réseau. Le serveur backend n\'est pas accessible. Vérifiez que le serveur est démarré sur http://localhost:5000');
        }
        throw fetchError;
      });

      // Vérifier si la réponse est OK
      if (!response.ok) {
        // Essayer de lire l'erreur JSON
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Si ce n'est pas du JSON, lire le texte
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch (e2) {
            // Ignorer si on ne peut pas lire l'erreur
          }
        }
        throw new Error(errorMessage);
      }

      // Vérifier le type de contenu
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        // Si ce n'est pas du PDF, essayer de lire comme JSON pour voir l'erreur
        const errorData = await response.json().catch(() => ({ message: 'Réponse inattendue du serveur' }));
        throw new Error(errorData.message || 'Le serveur n\'a pas retourné un fichier PDF');
      }

      const blob = await response.blob();
      
      // Créer le lien de téléchargement
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Récupérer le nom de fichier depuis les headers ou utiliser un nom par défaut
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `commandes_${new Date().toISOString().split('T')[0]}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
      
      return { success: true };
    } catch (error) {
      console.error('Error exporting orders PDF:', error);
      throw error;
    }
  },

  // Products Management
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiEnhanced.get(`/products?${queryParams}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getProducts');
    }
  },

  async createProduct(data) {
    try {
      const response = await apiEnhanced.post('/products', data);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'createProduct');
    }
  },

  async updateProduct(productId, data) {
    try {
      const response = await apiEnhanced.put(`/products/${productId}`, data);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'updateProduct');
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await apiEnhanced.delete(`/products/${productId}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'deleteProduct');
    }
  },

  // Courses/Training Management
  async getCourses(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiEnhanced.get(`/training?${queryParams}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getCourses');
    }
  },

  async createCourse(data) {
    try {
      const response = await apiEnhanced.post('/training', data);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'createCourse');
    }
  },

  async updateCourse(courseId, data) {
    try {
      const response = await apiEnhanced.put(`/training/${courseId}`, data);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'updateCourse');
    }
  },

  async deleteCourse(courseId) {
    try {
      const response = await apiEnhanced.delete(`/training/${courseId}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'deleteCourse');
    }
  },

  // Tickets/Support Management
  async getTickets(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiEnhanced.get(`/tickets?${queryParams}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getTickets');
    }
  },

  async getTicket(ticketId) {
    try {
      const response = await apiEnhanced.get(`/tickets/${ticketId}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getTicket');
    }
  },

  async updateTicket(ticketId, data) {
    try {
      const response = await apiEnhanced.put(`/tickets/${ticketId}`, data);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'updateTicket');
    }
  },

  async addTicketComment(ticketId, content, type = 'comment') {
    try {
      const response = await apiEnhanced.post(`/tickets/${ticketId}/comments`, { content, type });
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'addTicketComment');
    }
  },

  async getTicketStats() {
    try {
      const response = await apiEnhanced.get('/tickets/stats');
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getTicketStats');
    }
  },

  async getTicketComments(ticketId) {
    try {
      const response = await apiEnhanced.get(`/tickets/${ticketId}/comments`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getTicketComments');
    }
  },

  // Quote Requests Management
  async getQuoteRequests(params = {}) {
    try {
      const response = await apiEnhanced.get('/admin/quote-requests', { params });
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getQuoteRequests');
    }
  },

  async getQuoteRequest(id) {
    try {
      const response = await apiEnhanced.get(`/admin/quote-requests/${id}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getQuoteRequest');
    }
  },

  async updateQuoteRequest(id, updateData) {
    try {
      const response = await apiEnhanced.put(`/admin/quote-requests/${id}`, updateData);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'updateQuoteRequest');
    }
  },

  // Contact Messages Management
  async getContactMessages(params = {}) {
    try {
      const response = await apiEnhanced.get('/admin/contact-messages', { params });
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getContactMessages');
    }
  },

  async getContactMessage(id) {
    try {
      const response = await apiEnhanced.get(`/admin/contact-messages/${id}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getContactMessage');
    }
  },

  async updateContactMessage(id, updateData) {
    try {
      const response = await apiEnhanced.put(`/admin/contact-messages/${id}`, updateData);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'updateContactMessage');
    }
  },

  async replyToContactMessage(id, message) {
    try {
      const response = await apiEnhanced.post(`/admin/contact-messages/${id}/reply`, { message });
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'replyToContactMessage');
    }
  },

  // Chatbot Questions Management
  async getChatbotQuestions(params = {}) {
    try {
      const response = await apiEnhanced.get('/admin/chatbot-questions', { params });
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getChatbotQuestions');
    }
  },

  async getChatbotQuestion(id) {
    try {
      const response = await apiEnhanced.get(`/admin/chatbot-questions/${id}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getChatbotQuestion');
    }
  },

  async updateChatbotQuestion(id, updateData) {
    try {
      const response = await apiEnhanced.put(`/admin/chatbot-questions/${id}`, updateData);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'updateChatbotQuestion');
    }
  },

  // Job Applications Management
  async getJobApplications(params = {}) {
    try {
      const response = await apiEnhanced.get('/admin/job-applications', { params });
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getJobApplications');
    }
  },

  async getJobApplication(id) {
    try {
      const response = await apiEnhanced.get(`/admin/job-applications/${id}`);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'getJobApplication');
    }
  },

  async updateJobApplication(id, updateData) {
    try {
      const response = await apiEnhanced.put(`/admin/job-applications/${id}`, updateData);
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error, 'updateJobApplication');
    }
  },
};

export default adminService;

