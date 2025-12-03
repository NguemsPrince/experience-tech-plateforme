import api from './api';

export const clientService = {
  // Create new client
  createClient: async (clientData) => {
    return await api.post('/client/create', clientData);
  },

  // Get all clients
  getClients: async () => {
    return await api.get('/client/list');
  },

  // Get client by ID
  getClient: async (id) => {
    return await api.get(`/client/${id}`);
  },

  // Update client
  updateClient: async (id, clientData) => {
    return await api.put(`/client/${id}`, clientData);
  },

  // Delete client
  deleteClient: async (id) => {
    return await api.delete(`/client/${id}`);
  }
};
