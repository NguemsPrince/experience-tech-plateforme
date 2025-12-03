const mongoose = require('mongoose');
require('dotenv').config();

// Import du modèle User
const User = require('./models/User');

// Configuration de la base de données
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience-tech';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

// Fonction pour créer un utilisateur de test
const createTestUser = async () => {
  try {
    // Informations de l'utilisateur de test
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'Test123',
      phone: '+235612345678',
      role: 'client',
      isEmailVerified: true,
      isActive: true
    };

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      console.log('⚠️  L\'utilisateur existe déjà. Mise à jour avec le rôle CLIENT...');
      existingUser.password = userData.password;
      existingUser.firstName = userData.firstName;
      existingUser.lastName = userData.lastName;
      existingUser.role = 'client'; // Forcer le rôle client
      existingUser.isEmailVerified = true;
      existingUser.isActive = true;
      await existingUser.save();
      console.log('✅ Utilisateur mis à jour avec succès ! (Rôle: client)');
    } else {
      // Créer un nouvel utilisateur
      const user = new User(userData);
      await user.save();
      console.log('✅ Utilisateur de test créé avec succès !');
    }
    
    // Vérifier le rôle après sauvegarde
    const verifyUser = await User.findOne({ email: userData.email }).select('firstName lastName email role');
    if (verifyUser) {
      console.log(`\n✓ Vérification: Rôle actuel = "${verifyUser.role}"`);
      if (verifyUser.role !== 'client') {
        console.log('⚠️  ATTENTION: Le rôle n\'est pas "client" !');
      }
    }
    
    console.log('\n📋 Informations de connexion :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email    : test@test.com');
    console.log('🔑 Mot de passe : Test123');
    console.log('👤 Nom complet : Test User');
    console.log('🎯 Rôle : client');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Vous pouvez maintenant vous connecter avec ces identifiants !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error.message);
    if (error.code === 11000) {
      console.error('   L\'email existe déjà. Tentative de mise à jour...');
    }
  }
};

// Fonction principale
const main = async () => {
  console.log('🚀 Création d\'un utilisateur de test...\n');
  await connectDB();
  await createTestUser();
  await mongoose.connection.close();
  console.log('\n✅ Processus terminé');
};

// Exécuter le script
main().catch(console.error);

