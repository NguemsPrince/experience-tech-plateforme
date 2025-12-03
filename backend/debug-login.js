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

// Fonction pour déboguer la connexion
const debugLogin = async () => {
  try {
    const email = 'demo@experience-tech.com';
    const password = 'demo123';
    
    console.log('🔍 Débogage de la connexion...');
    console.log(`📧 Email recherché: ${email}`);
    console.log(`🔑 Mot de passe testé: ${password}`);
    
    // Rechercher l'utilisateur
    const user = await User.findOne({ email }).select('+password');
    console.log('\n👤 Utilisateur trouvé:', user ? 'Oui' : 'Non');
    
    if (user) {
      console.log('📋 Détails de l\'utilisateur:');
      console.log(`   - ID: ${user._id}`);
      console.log(`   - Nom: ${user.firstName} ${user.lastName}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Rôle: ${user.role}`);
      console.log(`   - Actif: ${user.isActive}`);
      console.log(`   - Email vérifié: ${user.isEmailVerified}`);
      console.log(`   - Mot de passe haché: ${user.password ? 'Oui' : 'Non'}`);
      console.log(`   - Longueur du hash: ${user.password ? user.password.length : 0}`);
      
      // Tester la comparaison du mot de passe
      console.log('\n🔐 Test de comparaison du mot de passe...');
      const isMatch = await user.comparePassword(password);
      console.log(`   - Résultat: ${isMatch ? '✅ Correspond' : '❌ Ne correspond pas'}`);
      
      // Test direct avec bcrypt
      console.log('\n🧪 Test direct avec bcrypt...');
      const directMatch = await bcrypt.compare(password, user.password);
      console.log(`   - Résultat direct: ${directMatch ? '✅ Correspond' : '❌ Ne correspond pas'}`);
      
      // Créer un nouveau hash pour comparaison
      console.log('\n🔄 Test avec nouveau hash...');
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(password, salt);
      const newMatch = await bcrypt.compare(password, newHash);
      console.log(`   - Nouveau hash créé: ${newHash.length} caractères`);
      console.log(`   - Test nouveau hash: ${newMatch ? '✅ Correspond' : '❌ Ne correspond pas'}`);
      
    } else {
      console.log('❌ Aucun utilisateur trouvé avec cet email');
      
      // Lister tous les utilisateurs disponibles
      const allUsers = await User.find({}).select('email firstName lastName');
      console.log('\n📋 Utilisateurs disponibles:');
      allUsers.forEach((u, index) => {
        console.log(`   ${index + 1}. ${u.email} (${u.firstName} ${u.lastName})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du débogage:', error.message);
  }
};

// Fonction principale
const main = async () => {
  console.log('🐛 Débogage de la connexion...');
  await connectDB();
  await debugLogin();
  await mongoose.connection.close();
  console.log('\n✅ Débogage terminé');
};

// Exécuter le script
main().catch(console.error);
