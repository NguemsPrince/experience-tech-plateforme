const mongoose = require('mongoose');
const ForumCategory = require('./models/ForumCategory');
require('dotenv').config();

const initializeForumCategories = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/experience-tech');
    console.log('Connecté à MongoDB');

    // Vérifier si des catégories existent déjà
    const existingCategories = await ForumCategory.countDocuments();
    if (existingCategories > 0) {
      console.log('Des catégories existent déjà. Suppression des anciennes...');
      await ForumCategory.deleteMany({});
    }

    // Catégories par défaut
    const defaultCategories = [
      {
        name: 'Formations',
        description: 'Discussions sur les formations, certifications et apprentissage',
        icon: 'AcademicCapIcon',
        color: '#3B82F6',
        sortOrder: 1
      },
      {
        name: 'Développement',
        description: 'Programmation, développement web, mobile et logiciel',
        icon: 'CodeBracketIcon',
        color: '#10B981',
        sortOrder: 2
      },
      {
        name: 'Support Technique',
        description: 'Dépannage IT, résolution de problèmes techniques',
        icon: 'WrenchScrewdriverIcon',
        color: '#F59E0B',
        sortOrder: 3
      },
      {
        name: 'Services Numériques',
        description: 'Discussions sur nos services numériques et solutions',
        icon: 'ComputerDesktopIcon',
        color: '#8B5CF6',
        sortOrder: 4
      },
      {
        name: 'Impression & Design',
        description: 'Services d\'impression, design graphique et création visuelle',
        icon: 'PrinterIcon',
        color: '#EF4444',
        sortOrder: 5
      },
      {
        name: 'Commerce & E-commerce',
        description: 'Solutions e-commerce, boutiques en ligne et commerce digital',
        icon: 'ShoppingBagIcon',
        color: '#06B6D4',
        sortOrder: 6
      },
      {
        name: 'Réseaux & Infrastructure',
        description: 'Réseaux informatiques, infrastructure et sécurité',
        icon: 'ServerIcon',
        color: '#84CC16',
        sortOrder: 7
      },
      {
        name: 'Général',
        description: 'Discussions générales et questions diverses',
        icon: 'ChatBubbleLeftRightIcon',
        color: '#6B7280',
        sortOrder: 8
      }
    ];

    // Créer les catégories
    const createdCategories = await ForumCategory.insertMany(defaultCategories);
    console.log(`${createdCategories.length} catégories créées avec succès:`);
    
    createdCategories.forEach(category => {
      console.log(`- ${category.name}: ${category.description}`);
    });

    console.log('\nInitialisation des catégories du forum terminée !');
    process.exit(0);

  } catch (error) {
    console.error('Erreur lors de l\'initialisation des catégories:', error);
    process.exit(1);
  }
};

// Exécuter le script
initializeForumCategories();
