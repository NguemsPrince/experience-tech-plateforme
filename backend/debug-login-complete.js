const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const debugLoginComplete = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const email = 'admin@experiencetech-tchad.com';
    const password = 'admin123';

    console.log('\n🔍 Debug complet de la connexion:');
    console.log('='.repeat(50));
    console.log(`📧 Email recherché: ${email}`);
    console.log(`🔑 Mot de passe: ${password}`);

    // Step 1: Find user
    console.log('\n1️⃣ Recherche de l\'utilisateur...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      process.exit(1);
    }
    
    console.log('✅ Utilisateur trouvé');
    console.log(`👤 Nom: ${user.firstName} ${user.lastName}`);
    console.log(`👑 Rôle: ${user.role}`);
    console.log(`✅ Actif: ${user.isActive ? 'Oui' : 'Non'}`);
    console.log(`🔐 Email vérifié: ${user.isEmailVerified ? 'Oui' : 'Non'}`);
    console.log(`🔒 Mot de passe présent: ${user.password ? 'Oui' : 'Non'}`);
    
    if (user.password) {
      console.log(`📏 Longueur du hash: ${user.password.length} caractères`);
      console.log(`🔑 Début du hash: ${user.password.substring(0, 15)}...`);
    }

    // Step 2: Check if user is active
    console.log('\n2️⃣ Vérification du statut...');
    if (!user.isActive) {
      console.log('❌ Compte désactivé');
      process.exit(1);
    }
    console.log('✅ Compte actif');

    // Step 3: Test password comparison
    console.log('\n3️⃣ Test de comparaison du mot de passe...');
    try {
      const isMatch = await user.comparePassword(password);
      console.log(`✅ Comparaison: ${isMatch ? 'Réussi' : 'Échec'}`);
      
      if (!isMatch) {
        console.log('\n🔧 Tentative de correction du mot de passe...');
        
        // Hash the password again
        const saltRounds = 12;
        const newHashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Update user password
        user.password = newHashedPassword;
        await user.save();
        
        console.log('✅ Mot de passe mis à jour');
        
        // Test again
        const isMatchAfter = await user.comparePassword(password);
        console.log(`✅ Comparaison après correction: ${isMatchAfter ? 'Réussi' : 'Échec'}`);
      }
    } catch (compareError) {
      console.log(`❌ Erreur de comparaison: ${compareError.message}`);
    }

    // Step 4: Test JWT generation
    console.log('\n4️⃣ Test de génération JWT...');
    try {
      const token = user.generateAuthToken();
      console.log(`✅ Token généré: ${token ? 'Oui' : 'Non'}`);
      if (token) {
        console.log(`📏 Longueur: ${token.length} caractères`);
        console.log(`🔑 Début: ${token.substring(0, 20)}...`);
      }
    } catch (jwtError) {
      console.log(`❌ Erreur JWT: ${jwtError.message}`);
    }

    console.log('\n🎯 Résumé:');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Nom: ${user.firstName} ${user.lastName}`);
    console.log(`👑 Rôle: ${user.role}`);
    console.log(`✅ Actif: ${user.isActive ? 'Oui' : 'Non'}`);
    console.log(`🔐 Email vérifié: ${user.isEmailVerified ? 'Oui' : 'Non'}`);
    console.log(`🔒 Mot de passe: ${user.password ? 'Hashé' : 'Non hashé'}`);
    
  } catch (error) {
    console.error('❌ Error debugging login:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
debugLoginComplete();
