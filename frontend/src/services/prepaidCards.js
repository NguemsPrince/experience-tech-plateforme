import api from './api';

const prepaidCardsService = {
  // Valider un code de carte prépayée
  validate: async (code) => {
    const response = await api.post('/prepaid-cards/validate', { code });
    return response.data;
  },

  // Obtenir toutes les cartes prépayées (admin only)
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/prepaid-cards${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Obtenir une carte prépayée (admin only)
  getById: async (id) => {
    const response = await api.get(`/prepaid-cards/${id}`);
    return response.data;
  },

  // Créer une carte prépayée (admin only)
  create: async (cardData) => {
    const response = await api.post('/prepaid-cards', cardData);
    return response.data;
  },

  // Mettre à jour une carte prépayée (admin only)
  update: async (id, cardData) => {
    const response = await api.put(`/prepaid-cards/${id}`, cardData);
    return response.data;
  },

  // Supprimer une carte prépayée (admin only)
  delete: async (id) => {
    const response = await api.delete(`/prepaid-cards/${id}`);
    return response.data;
  }
};

export default prepaidCardsService;


