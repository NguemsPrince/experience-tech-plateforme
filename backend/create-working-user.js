const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

const createWorkingUser = async () => {
  try {
    await connectDB();
    
    // Supprimer tous les utilisateurs existants
    await User.deleteMany({});
    console.log('🗑️  Tous les utilisateurs supprimés');
    
    // Créer un utilisateur avec mot de passe simple
    const user = new User({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@test.com',
      password: 'demo123', // Le middleware pre('save') va hasher automatiquement
      phone: '+23512345678',
      role: 'client',
      isActive: true,
      isEmailVerified: true
    });
    
    await user.save();
    console.log('✅ Utilisateur créé avec succès');
    
    // Test de connexion
    const testUser = await User.findOne({ email: 'demo@test.com' }).select('+password');
    const isMatch = await testUser.comparePassword('demo123');
    
    if (isMatch) {
      console.log('🧪 Test de connexion: ✅ Fonctionne');
    } else {
      console.log('🧪 Test de connexion: ❌ Ne fonctionne pas');
    }
    
    console.log('\n📋 Compte de test fonctionnel :');
    console.log('📧 Email: demo@test.com');
    console.log('🔑 Mot de passe: demo123');
    console.log('✅ Processus terminé');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

createWorkingUser();