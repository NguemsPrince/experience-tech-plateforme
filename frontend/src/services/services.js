import api from './api';

export const servicesService = {
  // Get all services
  getAllServices: async () => {
    return await api.get('/services');
  },

  // Get single service
  getService: async (serviceId) => {
    return await api.get(`/services/${serviceId}`);
  },

  // Request quote for service
  requestQuote: async (serviceId, quoteData) => {
    return await api.post(`/services/${serviceId}/quote`, quoteData);
  }
};
