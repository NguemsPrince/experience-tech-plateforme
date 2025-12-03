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

// Fonction pour créer un utilisateur client
const createClientUser = async () => {
  try {
    // Informations de l'utilisateur CLIENT
    const userData = {
      firstName: 'Client',
      lastName: 'Test',
      email: 'client@test.com',
      password: 'Client123',
      phone: '+235612345679',
      role: 'client', // ROLE CLIENT, PAS ADMIN
      isEmailVerified: true,
      isActive: true
    };

    // Supprimer l'ancien utilisateur s'il existe pour éviter les conflits
    await User.deleteOne({ email: userData.email });

    // Créer un nouvel utilisateur
    const user = new User(userData);
    await user.save();
    
    // Vérifier le rôle après sauvegarde
    const verifyUser = await User.findOne({ email: userData.email }).select('firstName lastName email role');
    
    console.log('✅ Utilisateur CLIENT créé avec succès !');
    console.log(`\n✓ Vérification: Rôle actuel = "${verifyUser.role}"`);
    
    if (verifyUser.role !== 'client') {
      console.log('⚠️  ERREUR: Le rôle n\'est pas "client" !');
    } else {
      console.log('✅ Rôle confirmé : CLIENT (pas admin)');
    }
    
    console.log('\n📋 Informations de connexion :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email    : client@test.com');
    console.log('🔑 Mot de passe : Client123');
    console.log('👤 Nom complet : Client Test');
    console.log('🎯 Rôle : CLIENT (utilisateur normal, pas admin)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 IMPORTANT: Utilisez /login (pas /admin/login)');
    console.log('   Après connexion, vous serez redirigé vers /client');
    console.log('   Vous n\'aurez PAS accès au dashboard admin.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error.message);
  }
};

// Fonction principale
const main = async () => {
  console.log('🚀 Création d\'un utilisateur CLIENT (pas admin)...\n');
  await connectDB();
  await createClientUser();
  await mongoose.connection.close();
  console.log('\n✅ Processus terminé');
};

// Exécuter le script
main().catch(console.error);

