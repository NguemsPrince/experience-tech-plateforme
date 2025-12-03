import apiEnhanced from './apiEnhanced';

const settingsService = {
  // Récupérer tous les paramètres
  async getSettings() {
    try {
      const response = await apiEnhanced.get('/settings');
      // apiEnhanced retourne directement les données, pas besoin de response.data
      return response;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  // Récupérer uniquement les paramètres de paiement
  async getPaymentSettings() {
    try {
      const response = await apiEnhanced.get('/settings/payment');
      // apiEnhanced retourne directement les données
      return response;
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      throw error;
    }
  },

  // Mettre à jour les paramètres de paiement
  async updatePaymentSettings(paymentData) {
    try {
      console.log('Updating payment settings with data:', paymentData);
      const response = await apiEnhanced.put('/settings/payment', paymentData);
      // apiEnhanced retourne directement les données
      return response;
    } catch (error) {
      console.error('Error updating payment settings:', error);
      throw error;
    }
  },

  // Mettre à jour tous les paramètres
  async updateSettings(settingsData) {
    try {
      const response = await apiEnhanced.put('/settings', settingsData);
      // apiEnhanced retourne directement les données
      return response;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};

export default settingsService;

