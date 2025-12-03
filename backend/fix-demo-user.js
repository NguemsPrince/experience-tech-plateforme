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

// Fonction pour corriger l'utilisateur demo
const fixDemoUser = async () => {
  try {
    // Supprimer l'ancien utilisateur demo s'il existe
    await User.deleteOne({ email: 'demo@experience-tech.com' });
    console.log('🗑️  Ancien utilisateur demo supprimé');

    // Hasher le mot de passe correctement
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);
    console.log('🔐 Mot de passe haché avec succès');

    // Créer le nouvel utilisateur demo
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
    console.log('✅ Nouvel utilisateur demo créé avec succès !');
    
    // Tester la vérification du mot de passe
    const testUser = await User.findOne({ email: 'demo@experience-tech.com' });
    const isPasswordValid = await bcrypt.compare('demo123', testUser.password);
    console.log('🔍 Test de vérification du mot de passe:', isPasswordValid ? '✅ Valide' : '❌ Invalide');
    
    console.log('\n📋 Informations de connexion :');
    console.log('📧 Email: demo@experience-tech.com');
    console.log('🔑 Mot de passe: demo123');
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction de l\'utilisateur:', error.message);
  }
};

// Fonction principale
const main = async () => {
  console.log('🔧 Correction de l\'utilisateur demo...');
  await connectDB();
  await fixDemoUser();
  await mongoose.connection.close();
  console.log('✅ Processus terminé');
};

// Exécuter le script
main().catch(console.error);
