const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const createFreshAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Delete existing admin user
    await User.deleteOne({ email: 'admin@experiencetech-tchad.com' });
    console.log('🗑️ Ancien utilisateur admin supprimé');

    // Create new admin user
    const password = 'admin123';
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const adminUser = new User({
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@experiencetech-tchad.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
      phone: '+23560290510',
      address: {
        street: 'Avenue Charles de Gaulle',
        city: 'N\'Djamena',
        country: 'Tchad',
        zipCode: '0000'
      },
      preferences: {
        language: 'fr',
        notifications: {
          email: true,
          sms: true
        }
      },
      lastLogin: new Date(),
      loginCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await adminUser.save();
    
    console.log('✅ Nouvel utilisateur admin créé');
    
    // Test password verification
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    console.log(`🔒 Test mot de passe: ${isPasswordValid ? 'Réussi' : 'Échec'}`);
    
    // Test comparePassword method
    const isMatch = await adminUser.comparePassword(password);
    console.log(`🔐 Test comparePassword: ${isMatch ? 'Réussi' : 'Échec'}`);
    
    // Test JWT generation
    try {
      const token = adminUser.generateAuthToken();
      console.log(`🎫 Token JWT: ${token ? 'Généré' : 'Échec'}`);
    } catch (jwtError) {
      console.log(`❌ Erreur JWT: ${jwtError.message}`);
    }
    
    console.log('\n🎯 Compte admin créé:');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Mot de passe: ${password}`);
    console.log(`👑 Rôle: ${adminUser.role}`);
    console.log(`✅ Actif: ${adminUser.isActive ? 'Oui' : 'Non'}`);
    console.log(`🔐 Email vérifié: ${adminUser.isEmailVerified ? 'Oui' : 'Non'}`);
    console.log(`📱 Téléphone: ${adminUser.phone}`);
    console.log(`🌍 Localisation: ${adminUser.address.city}, ${adminUser.address.country}`);
    
    console.log('\n🎉 Le compte admin est prêt pour la connexion !');
    
  } catch (error) {
    console.error('❌ Error creating fresh admin:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createFreshAdmin();
