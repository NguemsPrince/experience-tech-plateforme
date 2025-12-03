const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const fixAdminPassword = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@experiencetech-tchad.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('\n🔧 Correction du mot de passe admin:');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Nom: ${adminUser.firstName} ${adminUser.lastName}`);
    
    // Hash the password
    const password = 'admin123';
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log(`🔒 Mot de passe original: ${password}`);
    console.log(`🔐 Mot de passe hashé: ${hashedPassword.substring(0, 20)}...`);
    
    // Update user
    adminUser.password = hashedPassword;
    adminUser.isEmailVerified = true;
    adminUser.isActive = true;
    adminUser.role = 'admin';
    adminUser.updatedAt = new Date();
    
    await adminUser.save();
    
    console.log('✅ Mot de passe mis à jour avec succès');
    
    // Test password verification
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    console.log(`✅ Test de vérification: ${isPasswordValid ? 'Réussi' : 'Échec'}`);
    
    console.log('\n🎯 Compte admin corrigé:');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Mot de passe: ${password}`);
    console.log(`👑 Rôle: ${adminUser.role}`);
    console.log(`✅ Actif: ${adminUser.isActive ? 'Oui' : 'Non'}`);
    console.log(`🔐 Email vérifié: ${adminUser.isEmailVerified ? 'Oui' : 'Non'}`);
    
    console.log('\n🎉 Le compte admin est maintenant prêt pour la connexion !');
    
  } catch (error) {
    console.error('❌ Error fixing admin password:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
fixAdminPassword();
