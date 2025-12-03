import api from './api';

export const ordersService = {
  createOrder: (payload) => api.post('/orders', payload),
  getOrders: () => api.get('/orders'),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
};

