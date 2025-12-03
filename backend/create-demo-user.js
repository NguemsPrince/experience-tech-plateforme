const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import du modèle User
const User = require('./models/User');

// Configuration de la base de données
const connectDB = async () => {
  try {
    const mongoUri = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_TEST_URI 
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/experience-tech';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

// Fonction pour créer un utilisateur de démonstration
const createDemoUser = async () => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: 'demo@experience-tech.com' });
    if (existingUser) {
      console.log('⚠️  L\'utilisateur demo existe déjà');
      console.log('📧 Email: demo@experience-tech.com');
      console.log('🔑 Mot de passe: demo123');
      return;
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    // Créer l'utilisateur de démonstration
    const demoUser = new User({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@experience-tech.com',
      password: hashedPassword,
      role: 'client',
      isEmailVerified: true,
      isActive: true,
      preferences: {
        language: 'fr',
        notifications: {
          email: true,
          push: true
        }
      },
      profile: {
        company: 'Expérience Tech Demo',
        phone: '+237 6XX XX XX XX',
        address: 'Douala, Cameroun',
        bio: 'Compte de démonstration pour tester le dashboard Expérience Tech'
      }
    });

    await demoUser.save();
    
    console.log('✅ Utilisateur de démonstration créé avec succès !');
    console.log('📧 Email: demo@experience-tech.com');
    console.log('🔑 Mot de passe: demo123');
    console.log('👤 Nom: Demo User');
    console.log('🏢 Entreprise: Expérience Tech Demo');
    console.log('🎯 Rôle: Client');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error.message);
  }
};

// Fonction principale
const main = async () => {
  console.log('🚀 Création d\'un utilisateur de démonstration...');
  await connectDB();
  await createDemoUser();
  await mongoose.connection.close();
  console.log('✅ Processus terminé');
};

// Exécuter le script
main().catch(console.error);
