// Service pour les données du dashboard moderne
class DashboardService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  // Récupérer les statistiques du dashboard
  async getDashboardStats() {
    try {
      // Simulation de données pour le moment
      // Dans une vraie application, vous feriez un appel API ici
      return {
        totalRevenue: 150000,
        budget: 150000,
        totalProjects: 1,
        progress: 0,
        userGrowth: 12,
        monthlyGrowth: 8,
        projectGrowth: 15,
        trainingGrowth: 3
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        totalRevenue: 0,
        budget: 0,
        totalProjects: 0,
        progress: 0,
        userGrowth: 0,
        monthlyGrowth: 0,
        projectGrowth: 0,
        trainingGrowth: 0
      };
    }
  }

  // Récupérer les données des graphiques
  async getChartData(period = '7days') {
    try {
      // Simulation de données pour différents périodes
      const dataByPeriod = {
        '7days': [
          { day: 'Lun', value: 28000 },
          { day: 'Mar', value: 30000 },
          { day: 'Mer', value: 32000 },
          { day: 'Jeu', value: 29000 },
          { day: 'Ven', value: 26000 },
          { day: 'Sam', value: 23000 },
          { day: 'Dim', value: 25000 }
        ],
        '30days': [
          { day: 'Sem 1', value: 120000 },
          { day: 'Sem 2', value: 135000 },
          { day: 'Sem 3', value: 128000 },
          { day: 'Sem 4', value: 142000 }
        ],
        '90days': [
          { day: 'Mois 1', value: 450000 },
          { day: 'Mois 2', value: 480000 },
          { day: 'Mois 3', value: 520000 }
        ],
        '1year': [
          { day: 'Q1', value: 1200000 },
          { day: 'Q2', value: 1350000 },
          { day: 'Q3', value: 1280000 },
          { day: 'Q4', value: 1420000 }
        ]
      };

      return dataByPeriod[period] || dataByPeriod['7days'];
    } catch (error) {
      console.error('Erreur lors de la récupération des données de graphique:', error);
      return [];
    }
  }

  // Récupérer les activités récentes
  async getRecentActivities() {
    try {
      return [
        {
          id: 1,
          type: 'user',
          title: 'Nouvel utilisateur inscrit',
          description: 'Marie Kouassi s\'est inscrite sur la plateforme',
          time: 'Il y a 5 minutes',
          icon: 'UserIcon',
          color: 'text-green-500',
          bgColor: 'bg-green-100 dark:bg-green-900/30'
        },
        {
          id: 2,
          type: 'project',
          title: 'Projet terminé',
          description: 'Site web e-commerce pour ABC Company',
          time: 'Il y a 1 heure',
          icon: 'CheckCircleIcon',
          color: 'text-blue-500',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
          id: 3,
          type: 'training',
          title: 'Nouvelle formation ajoutée',
          description: 'Formation React.js avancé',
          time: 'Il y a 2 heures',
          icon: 'AcademicCapIcon',
          color: 'text-purple-500',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30'
        },
        {
          id: 4,
          type: 'warning',
          title: 'Paiement en attente',
          description: 'Facture #1234 en attente de paiement',
          time: 'Il y a 3 heures',
          icon: 'ExclamationTriangleIcon',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
        },
        {
          id: 5,
          type: 'info',
          title: 'Mise à jour système',
          description: 'Mise à jour de sécurité appliquée',
          time: 'Il y a 4 heures',
          icon: 'InformationCircleIcon',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30'
        }
      ];
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      return [];
    }
  }

  // Récupérer les notifications
  async getNotifications() {
    try {
      return [
        {
          id: 1,
          type: 'success',
          title: 'Projet terminé avec succès',
          message: 'Le projet "Site e-commerce" a été livré dans les temps',
          time: 'Il y a 5 minutes',
          icon: 'CheckIcon',
          color: 'text-green-500',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          unread: true
        },
        {
          id: 2,
          type: 'warning',
          title: 'Paiement en attente',
          message: 'Facture #1234 en attente de paiement depuis 3 jours',
          time: 'Il y a 1 heure',
          icon: 'ExclamationTriangleIcon',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          unread: true
        },
        {
          id: 3,
          type: 'info',
          title: 'Nouvel utilisateur inscrit',
          message: 'Marie Kouassi s\'est inscrite sur la plateforme',
          time: 'Il y a 2 heures',
          icon: 'UserIcon',
          color: 'text-blue-500',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          unread: false
        }
      ];
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return [];
    }
  }

  // Exécuter une action rapide
  async executeQuickAction(actionId) {
    try {
      console.log(`Exécution de l'action: ${actionId}`);
      
      // Simulation d'exécution d'action
      const actions = {
        'add-user': () => console.log('Ouverture du formulaire d\'ajout d\'utilisateur'),
        'create-project': () => console.log('Ouverture du formulaire de création de projet'),
        'add-training': () => console.log('Ouverture du formulaire d\'ajout de formation'),
        'generate-report': () => console.log('Génération du rapport en cours...'),
        'system-settings': () => console.log('Ouverture des paramètres système'),
        'send-notification': () => console.log('Ouverture du formulaire d\'envoi de notification')
      };

      if (actions[actionId]) {
        actions[actionId]();
        return { success: true, message: 'Action exécutée avec succès' };
      } else {
        throw new Error('Action non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'action:', error);
      return { success: false, message: 'Erreur lors de l\'exécution de l\'action' };
    }
  }

  // Rechercher dans le dashboard
  async searchDashboard(query) {
    try {
      console.log(`Recherche dans le dashboard: ${query}`);
      
      // Simulation de résultats de recherche
      const mockResults = {
        users: [
          { id: 1, name: 'Marie Kouassi', type: 'Utilisateur', email: 'marie@example.com' },
          { id: 2, name: 'Jean Dupont', type: 'Utilisateur', email: 'jean@example.com' }
        ],
        projects: [
          { id: 1, name: 'Site e-commerce', type: 'Projet', status: 'Terminé' },
          { id: 2, name: 'Application mobile', type: 'Projet', status: 'En cours' }
        ],
        trainings: [
          { id: 1, name: 'React.js avancé', type: 'Formation', students: 25 },
          { id: 2, name: 'Node.js', type: 'Formation', students: 18 }
        ]
      };

      return mockResults;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return { users: [], projects: [], trainings: [] };
    }
  }
}

// Instance singleton
const dashboardService = new DashboardService();

export default dashboardService;
