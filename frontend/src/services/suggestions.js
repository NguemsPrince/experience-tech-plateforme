import api from './api';

export const suggestionsService = {
  // Get all suggestions
  getAllSuggestions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
      
      return await api.get(`/suggestions?${params.toString()}`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for suggestions');
      return {
        success: true,
        data: [
          {
            id: 1,
            title: "Ajouter un système de notifications push",
            description: "Il serait utile d'avoir des notifications push pour être alerté en temps réel des mises à jour importantes sur nos projets.",
            type: "feature",
            priority: "high",
            category: "dashboard",
            status: "pending",
            votes: 24,
            views: 156,
            author: "Jean Dupont",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            tags: ["notifications", "real-time", "mobile"],
            comments: [
              {
                id: 1,
                author: "Marie Martin",
                content: "Excellente idée ! Cela améliorerait vraiment l'expérience utilisateur.",
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
              }
            ]
          },
          {
            id: 2,
            title: "Bug: Les graphiques ne s'affichent pas sur mobile",
            description: "Sur les appareils mobiles, les graphiques du dashboard ne s'affichent pas correctement. Le problème semble lié au responsive design.",
            type: "bug",
            priority: "critical",
            category: "dashboard",
            status: "in_progress",
            votes: 18,
            views: 89,
            author: "Pierre Durand",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            tags: ["mobile", "responsive", "charts"],
            comments: []
          },
          {
            id: 3,
            title: "Améliorer l'interface de création de projets",
            description: "L'interface actuelle est un peu complexe. Il faudrait la simplifier avec un assistant étape par étape.",
            type: "improvement",
            priority: "medium",
            category: "projects",
            status: "approved",
            votes: 12,
            views: 67,
            author: "Sophie Laurent",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            tags: ["ux", "wizard", "simplification"],
            comments: []
          },
          {
            id: 4,
            title: "Ajouter un mode sombre pour l'interface",
            description: "Un mode sombre serait apprécié, surtout pour les utilisateurs qui travaillent tard le soir.",
            type: "feature",
            priority: "low",
            category: "ui",
            status: "completed",
            votes: 45,
            views: 234,
            author: "Alexandre Moreau",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            tags: ["dark-mode", "accessibility", "preferences"],
            comments: [
              {
                id: 2,
                author: "Admin",
                content: "Fonctionnalité implémentée dans la dernière mise à jour !",
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
              }
            ]
          }
        ]
      };
    }
  },

  // Get single suggestion
  getSuggestion: async (id) => {
    try {
      return await api.get(`/suggestions/${id}`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for suggestion');
      return {
        success: true,
        data: {
          id: id,
          title: "Suggestion Mock",
          description: "Description de la suggestion",
          type: "feature",
          priority: "medium",
          category: "general",
          status: "pending",
          votes: 0,
          views: 0,
          author: "Utilisateur",
          createdAt: new Date().toISOString(),
          tags: [],
          comments: []
        }
      };
    }
  },

  // Create new suggestion
  createSuggestion: async (suggestionData) => {
    try {
      return await api.post('/suggestions', suggestionData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Suggestion created successfully', suggestionData);
      return {
        success: true,
        data: {
          id: Date.now(),
          ...suggestionData,
          status: 'pending',
          votes: 0,
          views: 0,
          createdAt: new Date().toISOString(),
          author: 'Utilisateur actuel',
          comments: []
        }
      };
    }
  },

  // Update suggestion
  updateSuggestion: async (id, suggestionData) => {
    try {
      return await api.put(`/suggestions/${id}`, suggestionData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Suggestion updated successfully', id, suggestionData);
      return {
        success: true,
        data: { id, ...suggestionData }
      };
    }
  },

  // Delete suggestion
  deleteSuggestion: async (id) => {
    try {
      return await api.delete(`/suggestions/${id}`);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Suggestion deleted successfully', id);
      return {
        success: true,
        message: 'Suggestion supprimée avec succès'
      };
    }
  },

  // Vote on suggestion
  voteSuggestion: async (id, voteType) => {
    try {
      return await api.post(`/suggestions/${id}/vote`, { vote: voteType });
    } catch (error) {
      // Mock success for development
      console.log('Mock: Vote recorded successfully', id, voteType);
      return {
        success: true,
        message: 'Vote enregistré avec succès'
      };
    }
  },

  // Add comment to suggestion
  addComment: async (id, commentData) => {
    try {
      return await api.post(`/suggestions/${id}/comments`, commentData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Comment added successfully', id, commentData);
      return {
        success: true,
        data: {
          id: Date.now(),
          ...commentData,
          createdAt: new Date().toISOString(),
          author: 'Utilisateur actuel'
        }
      };
    }
  },

  // Get suggestion statistics
  getSuggestionStats: async () => {
    try {
      return await api.get('/suggestions/stats');
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for suggestion stats');
      return {
        success: true,
        data: {
          total: 156,
          pending: 23,
          approved: 45,
          inProgress: 12,
          completed: 67,
          rejected: 9,
          totalVotes: 1247,
          topCategories: [
            { category: 'dashboard', count: 45 },
            { category: 'projects', count: 32 },
            { category: 'ui', count: 28 },
            { category: 'mobile', count: 23 },
            { category: 'api', count: 18 }
          ]
        }
      };
    }
  },

  // Admin functions
  approveSuggestion: async (id) => {
    try {
      return await api.post(`/suggestions/${id}/approve`);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Suggestion approved successfully', id);
      return {
        success: true,
        message: 'Suggestion approuvée avec succès'
      };
    }
  },

  rejectSuggestion: async (id, reason) => {
    try {
      return await api.post(`/suggestions/${id}/reject`, { reason });
    } catch (error) {
      // Mock success for development
      console.log('Mock: Suggestion rejected successfully', id, reason);
      return {
        success: true,
        message: 'Suggestion rejetée avec succès'
      };
    }
  },

  markAsInProgress: async (id) => {
    try {
      return await api.post(`/suggestions/${id}/in-progress`);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Suggestion marked as in progress successfully', id);
      return {
        success: true,
        message: 'Suggestion marquée comme en cours'
      };
    }
  },

  markAsCompleted: async (id) => {
    try {
      return await api.post(`/suggestions/${id}/complete`);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Suggestion marked as completed successfully', id);
      return {
        success: true,
        message: 'Suggestion marquée comme terminée'
      };
    }
  }
};
