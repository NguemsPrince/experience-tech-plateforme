const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// Fonction pour simuler l'API de connexion
const simulateAPILogin = async () => {
  try {
    const email = 'test@test.com';
    const password = '123456';
    
    console.log('🧪 Simulation de l\'API de connexion...');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Mot de passe: ${password}`);
    
    // Étape 1: Validation des données (comme dans l'API)
    if (!email || !password) {
      console.log('❌ Email ou mot de passe manquant');
      return;
    }
    
    // Étape 2: Recherche de l'utilisateur
    console.log('\n1️⃣ Recherche de l\'utilisateur...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }
    
    console.log('✅ Utilisateur trouvé:', user.firstName, user.lastName);
    
    // Étape 3: Vérification du statut actif
    if (!user.isActive) {
      console.log('❌ Compte désactivé');
      return;
    }
    
    console.log('✅ Compte actif');
    
    // Étape 4: Vérification du mot de passe
    console.log('\n2️⃣ Vérification du mot de passe...');
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('❌ Mot de passe incorrect');
      return;
    }
    
    console.log('✅ Mot de passe correct');
    
    // Étape 5: Mise à jour de la dernière connexion
    console.log('\n3️⃣ Mise à jour de la dernière connexion...');
    try {
      await user.updateLastLogin();
      console.log('✅ Dernière connexion mise à jour');
    } catch (error) {
      console.log('❌ Erreur updateLastLogin:', error.message);
      throw error;
    }
    
    // Étape 6: Génération du token
    console.log('\n4️⃣ Génération du token...');
    let token;
    try {
      token = user.generateAuthToken();
      console.log('✅ Token généré');
    } catch (error) {
      console.log('❌ Erreur generateAuthToken:', error.message);
      throw error;
    }
    
    // Étape 7: Génération du refresh token
    console.log('\n5️⃣ Génération du refresh token...');
    let refreshToken;
    try {
      refreshToken = user.generateRefreshToken();
      console.log('✅ Refresh token généré');
    } catch (error) {
      console.log('❌ Erreur generateRefreshToken:', error.message);
      throw error;
    }
    
    // Étape 8: Préparation de la réponse
    console.log('\n6️⃣ Préparation de la réponse...');
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    };
    
    const response = {
      success: true,
      token,
      user: userResponse,
      refreshToken
    };
    
    console.log('✅ Réponse préparée:');
    console.log('   - Success:', response.success);
    console.log('   - Token:', response.token ? 'Généré' : 'Non généré');
    console.log('   - User:', response.user.firstName, response.user.lastName);
    console.log('   - Refresh Token:', response.refreshToken ? 'Généré' : 'Non généré');
    
    console.log('\n🎉 Simulation réussie !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la simulation:', error.message);
    console.error('Stack:', error.stack);
  }
};

// Fonction principale
const main = async () => {
  console.log('🧪 Simulation de l\'API de connexion...');
  await connectDB();
  await simulateAPILogin();
  await mongoose.connection.close();
  console.log('✅ Simulation terminée');
};

// Exécuter le script
main().catch(console.error);
