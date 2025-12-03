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

// Fonction pour corriger le mot de passe
const fixPassword = async () => {
  try {
    const email = 'demo@experience-tech.com';
    const newPassword = 'demo123';
    
    console.log('🔧 Correction du mot de passe...');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Nouveau mot de passe: ${newPassword}`);
    
    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }
    
    console.log('👤 Utilisateur trouvé:', user.firstName, user.lastName);
    
    // Créer un nouveau hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('🔐 Nouveau hash créé');
    
    // Mettre à jour le mot de passe directement (bypass du middleware)
    await User.updateOne(
      { email: email },
      { password: hashedPassword }
    );
    
    console.log('✅ Mot de passe mis à jour');
    
    // Vérifier que ça fonctionne
    const updatedUser = await User.findOne({ email }).select('+password');
    const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
    console.log(`🧪 Test de vérification: ${isMatch ? '✅ Fonctionne' : '❌ Ne fonctionne pas'}`);
    
    console.log('\n📋 Informations de connexion corrigées :');
    console.log('📧 Email: demo@experience-tech.com');
    console.log('🔑 Mot de passe: demo123');
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error.message);
  }
};

// Fonction principale
const main = async () => {
  console.log('🔧 Correction du mot de passe...');
  await connectDB();
  await fixPassword();
  await mongoose.connection.close();
  console.log('✅ Processus terminé');
};

// Exécuter le script
main().catch(console.error);
