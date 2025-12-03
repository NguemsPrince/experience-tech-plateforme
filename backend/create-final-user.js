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

// Fonction pour créer un utilisateur final
const createFinalUser = async () => {
  try {
    // Supprimer tous les utilisateurs existants
    await User.deleteMany({});
    console.log('🗑️  Tous les utilisateurs supprimés');
    
    // Créer un utilisateur avec un mot de passe simple (le middleware le hachera)
    const user = new User({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@experience-tech.com',
      password: 'demo123', // Mot de passe en clair - le middleware le hachera
      role: 'client',
      isEmailVerified: true,
      isActive: true
    });
    
    // Sauvegarder (le middleware va hacher le mot de passe)
    await user.save();
    console.log('✅ Utilisateur créé avec succès');
    
    // Vérifier que le mot de passe fonctionne
    const testUser = await User.findOne({ email: 'demo@experience-tech.com' }).select('+password');
    const isMatch = await testUser.comparePassword('demo123');
    console.log(`🧪 Test de connexion: ${isMatch ? '✅ Fonctionne' : '❌ Ne fonctionne pas'}`);
    
    // Test direct avec bcrypt
    const directMatch = await bcrypt.compare('demo123', testUser.password);
    console.log(`🧪 Test direct bcrypt: ${directMatch ? '✅ Fonctionne' : '❌ Ne fonctionne pas'}`);
    
    console.log('\n📋 Compte de test final :');
    console.log('📧 Email: demo@experience-tech.com');
    console.log('🔑 Mot de passe: demo123');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
  }
};

// Fonction principale
const main = async () => {
  console.log('🚀 Création de l\'utilisateur final...');
  await connectDB();
  await createFinalUser();
  await mongoose.connection.close();
  console.log('✅ Processus terminé');
};

// Exécuter le script
main().catch(console.error);
