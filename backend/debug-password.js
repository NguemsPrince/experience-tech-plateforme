const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const debugPassword = async () => {
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

    console.log('\n🔍 Debug du mot de passe admin:');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Nom: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`👑 Rôle: ${adminUser.role}`);
    console.log(`✅ Actif: ${adminUser.isActive ? 'Oui' : 'Non'}`);
    console.log(`🔐 Email vérifié: ${adminUser.isEmailVerified ? 'Oui' : 'Non'}`);
    
    // Check password hash
    console.log(`🔒 Mot de passe hashé: ${adminUser.password ? 'Oui' : 'Non'}`);
    if (adminUser.password) {
      console.log(`📏 Longueur du hash: ${adminUser.password.length} caractères`);
      console.log(`🔑 Début du hash: ${adminUser.password.substring(0, 10)}...`);
      console.log(`🏷️ Type de hash: ${adminUser.password.startsWith('$2') ? 'bcrypt' : 'autre'}`);
    }
    
    // Test password verification
    const testPassword = 'admin123';
    console.log(`\n🧪 Test du mot de passe: "${testPassword}"`);
    
    try {
      const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password);
      console.log(`✅ Mot de passe valide: ${isPasswordValid ? 'Oui' : 'Non'}`);
      
      if (!isPasswordValid) {
        console.log('\n🔧 Tentative de correction du mot de passe...');
        
        // Hash the password again
        const saltRounds = 12;
        const newHashedPassword = await bcrypt.hash(testPassword, saltRounds);
        
        // Update user password
        adminUser.password = newHashedPassword;
        await adminUser.save();
        
        console.log('✅ Mot de passe mis à jour');
        
        // Test again
        const isPasswordValidAfter = await bcrypt.compare(testPassword, adminUser.password);
        console.log(`✅ Mot de passe valide après correction: ${isPasswordValidAfter ? 'Oui' : 'Non'}`);
      }
    } catch (bcryptError) {
      console.log(`❌ Erreur bcrypt: ${bcryptError.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error debugging password:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
debugPassword();
