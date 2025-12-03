import api from './api';

export const paymentsService = {
  // Create payment intent for course enrollment
  createPaymentIntent: async (courseId, paymentMethod = 'airtel_money', provider = 'airtel_money', prepaidCardCode = null) => {
    try {
      const response = await api.post('/payments/create-intent', {
        courseId,
        paymentMethod,
        provider,
        prepaidCardCode
      });
      return response.data;
    } catch (error) {
      console.error('Create payment intent error:', error);
      throw error;
    }
  },

  // Confirm payment
  confirmPayment: async (paymentId, paymentIntentId = null) => {
    try {
      const response = await api.post('/payments/confirm', {
        paymentId,
        paymentIntentId
      });
      return response.data;
    } catch (error) {
      console.error('Confirm payment error:', error);
      throw error;
    }
  },

  // Get payment history
  getPaymentHistory: async (page = 1, limit = 10, status = null) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) {
        params.append('status', status);
      }

      const response = await api.get(`/payments/history?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get payment history error:', error);
      throw error;
    }
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Get payment details error:', error);
      throw error;
    }
  },

  // Cancel payment
  cancelPayment: async (paymentId) => {
    try {
      const response = await api.post(`/payments/${paymentId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel payment error:', error);
      throw error;
    }
  },

  // Créer un paiement mobile money (Airtel Money ou Moov Money)
  createMobileMoneyPayment: async (items, paymentMethod, phoneNumber, orderId = null) => {
    try {
      const response = await api.post('/payments/create-mobile-money', {
        items,
        paymentMethod,
        phoneNumber,
        orderId
      });
      return response.data;
    } catch (error) {
      console.error('Create mobile money payment error:', error);
      throw error;
    }
  },

  // Vérifier le statut d'un paiement (pour polling)
  checkPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}/status`);
      return response.data;
    } catch (error) {
      console.error('Check payment status error:', error);
      throw error;
    }
  }
};

export default paymentsService;
