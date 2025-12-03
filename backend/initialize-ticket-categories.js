const mongoose = require('mongoose');
const TicketCategory = require('./models/TicketCategory');
require('dotenv').config();

const defaultCategories = [
  {
    name: 'technical',
    description: 'Problèmes techniques et bugs',
    isDefault: true,
    priority: 'high',
    sla: {
      responseTime: 4, // 4 heures
      resolutionTime: 24 // 24 heures
    },
    defaultTags: ['bug', 'technical'],
    color: '#EF4444',
    icon: 'bug',
    responseTemplate: {
      subject: 'Votre demande technique a été reçue',
      content: 'Nous avons bien reçu votre demande technique. Notre équipe va examiner le problème et vous répondre dans les plus brefs délais.'
    }
  },
  {
    name: 'billing',
    description: 'Questions de facturation et paiements',
    isDefault: false,
    priority: 'medium',
    sla: {
      responseTime: 8, // 8 heures
      resolutionTime: 48 // 48 heures
    },
    defaultTags: ['billing', 'payment'],
    color: '#10B981',
    icon: 'credit-card',
    responseTemplate: {
      subject: 'Votre demande de facturation a été reçue',
      content: 'Nous avons bien reçu votre demande concernant la facturation. Notre équipe comptable va traiter votre demande rapidement.'
    }
  },
  {
    name: 'training',
    description: 'Demandes de formation et certifications',
    isDefault: false,
    priority: 'medium',
    sla: {
      responseTime: 12, // 12 heures
      resolutionTime: 72 // 72 heures
    },
    defaultTags: ['training', 'education'],
    color: '#3B82F6',
    icon: 'book-open',
    responseTemplate: {
      subject: 'Votre demande de formation a été reçue',
      content: 'Merci pour votre intérêt pour nos formations. Notre équipe pédagogique va vous contacter pour discuter de vos besoins.'
    }
  },
  {
    name: 'service',
    description: 'Service client et support général',
    isDefault: false,
    priority: 'medium',
    sla: {
      responseTime: 6, // 6 heures
      resolutionTime: 24 // 24 heures
    },
    defaultTags: ['support', 'general'],
    color: '#8B5CF6',
    icon: 'headphones',
    responseTemplate: {
      subject: 'Votre demande de support a été reçue',
      content: 'Nous avons bien reçu votre demande. Notre équipe de support va vous aider dans les plus brefs délais.'
    }
  },
  {
    name: 'bug_report',
    description: 'Signalement de bugs et problèmes',
    isDefault: false,
    priority: 'high',
    sla: {
      responseTime: 2, // 2 heures
      resolutionTime: 12 // 12 heures
    },
    defaultTags: ['bug', 'report'],
    color: '#F59E0B',
    icon: 'alert-triangle',
    responseTemplate: {
      subject: 'Merci pour votre signalement de bug',
      content: 'Nous avons bien reçu votre signalement. Notre équipe de développement va examiner le problème et le corriger rapidement.'
    }
  },
  {
    name: 'feature_request',
    description: 'Demandes de nouvelles fonctionnalités',
    isDefault: false,
    priority: 'low',
    sla: {
      responseTime: 24, // 24 heures
      resolutionTime: 168 // 1 semaine
    },
    defaultTags: ['feature', 'enhancement'],
    color: '#06B6D4',
    icon: 'lightbulb',
    responseTemplate: {
      subject: 'Votre demande de fonctionnalité a été reçue',
      content: 'Merci pour votre suggestion ! Notre équipe de développement va examiner votre demande et vous tenir informé.'
    }
  },
  {
    name: 'general',
    description: 'Demandes générales et autres',
    isDefault: false,
    priority: 'low',
    sla: {
      responseTime: 12, // 12 heures
      resolutionTime: 48 // 48 heures
    },
    defaultTags: ['general', 'other'],
    color: '#6B7280',
    icon: 'help-circle',
    responseTemplate: {
      subject: 'Votre demande a été reçue',
      content: 'Nous avons bien reçu votre demande. Notre équipe va examiner votre demande et vous répondre rapidement.'
    }
  }
];

const initializeCategories = async () => {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Supprimer les catégories existantes
    await TicketCategory.deleteMany({});
    console.log('Cleared existing categories');

    // Créer les catégories par défaut
    const categories = await TicketCategory.insertMany(defaultCategories);
    console.log(`Created ${categories.length} default categories`);

    // Afficher les catégories créées
    categories.forEach(category => {
      console.log(`- ${category.name}: ${category.description}`);
    });

    console.log('Categories initialization completed successfully');
  } catch (error) {
    console.error('Error initializing categories:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Exécuter le script
if (require.main === module) {
  initializeCategories();
}

module.exports = { initializeCategories, defaultCategories };
