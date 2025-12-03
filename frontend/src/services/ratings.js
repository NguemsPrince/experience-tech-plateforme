import api from './api';

export const ratingsService = {
  // Noter une formation
  rateCourse: async (courseId, rating) => {
    try {
      const response = await api.post(`/courses/${courseId}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
      throw error;
    }
  },

  // Obtenir les notes d'une formation
  getCourseRatings: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/ratings`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes:', error);
      throw error;
    }
  },

  // Obtenir la note d'un utilisateur pour une formation
  getUserRating: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/user-rating`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la note utilisateur:', error);
      throw error;
    }
  },

  // Mettre à jour une note
  updateRating: async (courseId, rating) => {
    try {
      const response = await api.put(`/courses/${courseId}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error);
      throw error;
    }
  },

  // Supprimer une note
  deleteRating: async (courseId) => {
    try {
      const response = await api.delete(`/courses/${courseId}/rate`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
      throw error;
    }
  },

  // Obtenir toutes les notes d'un utilisateur
  getUserRatings: async () => {
    try {
      const response = await api.get('/ratings/user');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes utilisateur:', error);
      throw error;
    }
  }
};

export default ratingsService;
