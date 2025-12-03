import api from './api';

export const contactService = {
  // Send contact message
  sendMessage: async (messageData) => {
    return await api.post('/contact', messageData);
  },

  // Get contact information
  getContactInfo: async () => {
    return await api.get('/contact/info');
  }
};
