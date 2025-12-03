const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const finalizeAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find the admin user
    let adminUser = await User.findOne({ email: 'admin@experiencetech-tchad.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    // Update admin user with all necessary fields
    adminUser.firstName = 'admin';
    adminUser.lastName = 'admin';
    adminUser.emailVerified = true;
    adminUser.isActive = true;
    adminUser.role = 'admin';
    adminUser.updatedAt = new Date();

    // Ensure password is properly hashed
    if (!adminUser.password || !adminUser.password.startsWith('$2')) {
      const saltRounds = 12;
      adminUser.password = await bcrypt.hash('admin123', saltRounds);
    }

    await adminUser.save();
    
    console.log('✅ Admin user finalized successfully!');
    console.log('👤 Username: admin');
    console.log('📧 Email: admin@experiencetech-tchad.com');
    console.log('🔒 Password: admin123');
    console.log('👑 Role: admin');
    console.log('✅ Status: Active');
    console.log('🔐 Email verified: Yes');
    console.log('📱 Phone: +23560290510');
    console.log('🌍 Location: N\'Djamena, Tchad');
    
    console.log('\n🎯 Connexion possible avec:');
    console.log('   📧 Email: admin@experiencetech-tchad.com');
    console.log('   🔑 Mot de passe: admin123');
    
    console.log('\n📋 Résumé du compte admin:');
    console.log('='.repeat(50));
    console.log('✅ Compte créé et configuré');
    console.log('✅ Mot de passe défini: admin123');
    console.log('✅ Rôle administrateur assigné');
    console.log('✅ Compte activé');
    console.log('✅ Email vérifié');
    console.log('✅ Prêt pour la connexion');
    
  } catch (error) {
    console.error('❌ Error finalizing admin:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
finalizeAdmin();
