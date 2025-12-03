import api from './api';

export const trainingsService = {
  // Get all trainings
  getAllTrainings: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
      
      return await api.get(`/training?${params.toString()}`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for trainings');
      return {
        success: true,
        data: [
          {
            id: 1,
            title: "React Avancé - Hooks et Performance",
            description: "Formation approfondie sur les hooks React, l'optimisation des performances et les bonnes pratiques de développement.",
            instructor: "Jean Dupont",
            duration: "3 jours",
            level: "avancé",
            category: "développement",
            price: 899,
            maxParticipants: 15,
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: "programmé",
            image: "/images/react-training.jpg",
            prerequisites: ["Connaissances de base en React", "JavaScript ES6+"],
            objectives: [
              "Maîtriser les hooks avancés",
              "Optimiser les performances",
              "Implémenter les bonnes pratiques"
            ],
            curriculum: [
              { module: 1, title: "Introduction aux hooks avancés", duration: "2h" },
              { module: 2, title: "useCallback et useMemo", duration: "3h" },
              { module: 3, title: "Optimisation des performances", duration: "4h" },
              { module: 4, title: "Tests et debugging", duration: "3h" }
            ],
            enrolledStudents: 8,
            rating: 4.8,
            reviews: 24,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            title: "UI/UX Design - Principes et Outils",
            description: "Apprenez les fondamentaux du design d'interface utilisateur avec les outils modernes comme Figma et Adobe XD.",
            instructor: "Marie Martin",
            duration: "2 jours",
            level: "débutant",
            category: "design",
            price: 649,
            maxParticipants: 12,
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
            status: "programmé",
            image: "/images/design-training.jpg",
            prerequisites: ["Aucun prérequis"],
            objectives: [
              "Comprendre les principes UX",
              "Maîtriser Figma",
              "Créer des prototypes"
            ],
            curriculum: [
              { module: 1, title: "Introduction à l'UX", duration: "2h" },
              { module: 2, title: "Figma - Les bases", duration: "3h" },
              { module: 3, title: "Prototypage", duration: "3h" },
              { module: 4, title: "Test utilisateur", duration: "2h" }
            ],
            enrolledStudents: 12,
            rating: 4.6,
            reviews: 18,
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            title: "DevOps avec Docker et Kubernetes",
            description: "Formation complète sur la conteneurisation et l'orchestration avec Docker et Kubernetes.",
            instructor: "Pierre Durand",
            duration: "4 jours",
            level: "intermédiaire",
            category: "devops",
            price: 1299,
            maxParticipants: 10,
            startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            status: "programmé",
            image: "/images/devops-training.jpg",
            prerequisites: ["Linux", "Concepts de base du développement"],
            objectives: [
              "Maîtriser Docker",
              "Orchestrer avec Kubernetes",
              "Mettre en place CI/CD"
            ],
            curriculum: [
              { module: 1, title: "Introduction à Docker", duration: "4h" },
              { module: 2, title: "Images et conteneurs", duration: "4h" },
              { module: 3, title: "Kubernetes - Les bases", duration: "6h" },
              { module: 4, title: "CI/CD et monitoring", duration: "6h" }
            ],
            enrolledStudents: 6,
            rating: 4.9,
            reviews: 12,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            title: "Marketing Digital - Stratégies et Outils",
            description: "Découvrez les stratégies de marketing digital modernes et les outils pour maximiser votre impact en ligne.",
            instructor: "Sophie Laurent",
            duration: "3 jours",
            level: "débutant",
            category: "marketing",
            price: 799,
            maxParticipants: 20,
            startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
            status: "programmé",
            image: "/images/marketing-training.jpg",
            prerequisites: ["Aucun prérequis"],
            objectives: [
              "Comprendre le marketing digital",
              "Maîtriser les réseaux sociaux",
              "Analyser les performances"
            ],
            curriculum: [
              { module: 1, title: "Stratégies digitales", duration: "3h" },
              { module: 2, title: "Réseaux sociaux", duration: "4h" },
              { module: 3, title: "SEO et SEM", duration: "4h" },
              { module: 4, title: "Analytics et ROI", duration: "3h" }
            ],
            enrolledStudents: 18,
            rating: 4.7,
            reviews: 31,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      };
    }
  },

  // Get single training
  getTraining: async (id) => {
    try {
      return await api.get(`/training/${id}`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for training');
      return {
        success: true,
        data: {
          id: id,
          title: "Formation Mock",
          description: "Description de la formation",
          instructor: "Instructeur",
          duration: "2 jours",
          level: "débutant",
          category: "développement",
          price: 500,
          maxParticipants: 10,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          status: "programmé",
          image: "/images/training.jpg",
          prerequisites: [],
          objectives: [],
          curriculum: [],
          enrolledStudents: 0,
          rating: 0,
          reviews: 0,
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  // Create new training
  createTraining: async (trainingData) => {
    try {
      return await api.post('/training', trainingData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Training created successfully', trainingData);
      return {
        success: true,
        data: {
          id: Date.now(),
          ...trainingData,
          enrolledStudents: 0,
          rating: 0,
          reviews: 0,
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  // Update training
  updateTraining: async (id, trainingData) => {
    try {
      return await api.put(`/training/${id}`, trainingData);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Training updated successfully', id, trainingData);
      return {
        success: true,
        data: { id, ...trainingData }
      };
    }
  },

  // Delete training
  deleteTraining: async (id) => {
    try {
      return await api.delete(`/training/${id}`);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Training deleted successfully', id);
      return {
        success: true,
        message: 'Formation supprimée avec succès'
      };
    }
  },

  // Enroll in training
  enrollInTraining: async (id) => {
    try {
      return await api.post(`/training/${id}/enroll`);
    } catch (error) {
      // Mock success for development
      console.log('Mock: Enrollment successful', id);
      return {
        success: true,
        message: 'Inscription réussie'
      };
    }
  },

  // Get training statistics
  getTrainingStats: async () => {
    try {
      return await api.get('/training/stats');
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for training stats');
      return {
        success: true,
        data: {
          total: 24,
          active: 18,
          completed: 156,
          upcoming: 6,
          totalParticipants: 1247,
          averageRating: 4.7,
          topCategories: [
            { category: 'développement', count: 8 },
            { category: 'design', count: 6 },
            { category: 'devops', count: 4 },
            { category: 'marketing', count: 6 }
          ]
        }
      };
    }
  },

  // Get user's enrolled trainings
  getUserTrainings: async (userId) => {
    try {
      return await api.get(`/users/${userId}/trainings`);
    } catch (error) {
      // Mock data for development
      console.log('Using mock data for user trainings');
      return {
        success: true,
        data: [
          {
            id: 1,
            trainingId: 1,
            trainingTitle: "React Avancé - Hooks et Performance",
            status: "enrolled",
            enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 0,
            completedModules: []
          }
        ]
      };
    }
  }
};
