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

// Fonction pour lister les utilisateurs
const listUsers = async () => {
  try {
    const users = await User.find().select('firstName lastName email role isActive isEmailVerified').sort({ createdAt: -1 });
    
    console.log('\n📋 Liste des utilisateurs dans la base de données :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email'.padEnd(30) + ' | Nom complet'.padEnd(25) + ' | Rôle'.padEnd(12) + ' | Actif | Email vérifié');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (users.length === 0) {
      console.log('   Aucun utilisateur trouvé.');
    } else {
      users.forEach((user, index) => {
        const email = user.email.padEnd(30);
        const fullName = `${user.firstName} ${user.lastName}`.padEnd(25);
        const role = user.role.padEnd(12);
        const active = user.isActive ? 'Oui' : 'Non';
        const verified = user.isEmailVerified ? 'Oui' : 'Non';
        console.log(`${index + 1}. ${email} | ${fullName} | ${role} | ${active.padEnd(5)} | ${verified}`);
      });
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 Total: ${users.length} utilisateur(s)`);
    
    // Vérifier spécifiquement l'utilisateur test@test.com
    const testUser = await User.findOne({ email: 'test@test.com' }).select('firstName lastName email role isActive');
    if (testUser) {
      console.log('\n🔍 Utilisateur test@test.com trouvé :');
      console.log(`   Nom: ${testUser.firstName} ${testUser.lastName}`);
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Rôle: ${testUser.role}`);
      console.log(`   Actif: ${testUser.isActive}`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error.message);
  }
};

// Fonction principale
const main = async () => {
  await connectDB();
  await listUsers();
  await mongoose.connection.close();
  console.log('\n✅ Processus terminé');
};

// Exécuter le script
main().catch(console.error);
