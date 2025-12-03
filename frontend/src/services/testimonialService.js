import api from './api';

// Créer un témoignage
export const createTestimonial = async (testimonialData) => {
  try {
    const response = await api.post('/testimonials', testimonialData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtenir tous les témoignages (public)
export const getAllTestimonials = async (params = {}) => {
  try {
    const response = await api.get('/testimonials', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtenir les témoignages mis en avant
export const getFeaturedTestimonials = async (limit = 6) => {
  try {
    const response = await api.get('/testimonials/featured', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtenir les statistiques
export const getTestimonialStats = async () => {
  try {
    const response = await api.get('/testimonials/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtenir son propre témoignage
export const getMyTestimonial = async () => {
  try {
    const response = await api.get('/testimonials/my');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtenir un témoignage spécifique
export const getTestimonialById = async (id) => {
  try {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Mettre à jour son témoignage
export const updateTestimonial = async (id, testimonialData) => {
  try {
    const response = await api.put(`/testimonials/${id}`, testimonialData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Supprimer son témoignage
export const deleteTestimonial = async (id) => {
  try {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Marquer un témoignage comme utile
export const markTestimonialHelpful = async (id) => {
  try {
    const response = await api.post(`/testimonials/${id}/helpful`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Routes Admin
export const approveTestimonial = async (id) => {
  try {
    const response = await api.put(`/testimonials/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const featureTestimonial = async (id, isFeatured) => {
  try {
    const response = await api.put(`/testimonials/${id}/feature`, { isFeatured });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const respondToTestimonial = async (id, text) => {
  try {
    const response = await api.post(`/testimonials/${id}/response`, { text });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const testimonialService = {
  createTestimonial,
  getAllTestimonials,
  getFeaturedTestimonials,
  getTestimonialStats,
  getMyTestimonial,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  markTestimonialHelpful,
  approveTestimonial,
  featureTestimonial,
  respondToTestimonial
};

export default testimonialService;


