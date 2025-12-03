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

// Fonction pour créer un utilisateur simple
const createSimpleUser = async () => {
  try {
    // Supprimer tous les utilisateurs existants pour éviter les conflits
    await User.deleteMany({ email: { $in: ['demo@experience-tech.com', 'test@example.com', 'admin@test.com'] } });
    console.log('🗑️  Anciens utilisateurs supprimés');

    // Créer un utilisateur admin simple
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'client',
      isEmailVerified: true,
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Utilisateur admin créé avec succès !');
    
    // Créer un utilisateur demo simple
    const demoPassword = await bcrypt.hash('demo123', salt);
    const demoUser = new User({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@experience-tech.com',
      password: demoPassword,
      role: 'client',
      isEmailVerified: true,
      isActive: true
    });

    await demoUser.save();
    console.log('✅ Utilisateur demo créé avec succès !');
    
    console.log('\n📋 Comptes disponibles :');
    console.log('1. 📧 admin@test.com / 🔑 admin123');
    console.log('2. 📧 demo@experience-tech.com / 🔑 demo123');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error.message);
  }
};

// Fonction principale
const main = async () => {
  console.log('🚀 Création d\'utilisateurs simples...');
  await connectDB();
  await createSimpleUser();
  await mongoose.connection.close();
  console.log('✅ Processus terminé');
};

// Exécuter le script
main().catch(console.error);
