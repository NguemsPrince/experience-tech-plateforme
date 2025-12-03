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

// Fonction pour créer un utilisateur super simple
const createSuperSimpleUser = async () => {
  try {
    // Supprimer tous les utilisateurs existants
    await User.deleteMany({});
    console.log('🗑️  Tous les utilisateurs supprimés');
    
    // Créer un utilisateur avec un mot de passe très simple
    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: '123456', // Mot de passe très simple
      role: 'client',
      isEmailVerified: true,
      isActive: true
    });
    
    // Sauvegarder
    await user.save();
    console.log('✅ Utilisateur créé avec succès');
    
    console.log('\n📋 Compte de test super simple :');
    console.log('📧 Email: test@test.com');
    console.log('🔑 Mot de passe: 123456');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
  }
};

// Fonction principale
const main = async () => {
  console.log('🚀 Création d\'un utilisateur super simple...');
  await connectDB();
  await createSuperSimpleUser();
  await mongoose.connection.close();
  console.log('✅ Processus terminé');
};

// Exécuter le script
main().catch(console.error);
