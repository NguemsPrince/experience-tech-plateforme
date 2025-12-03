const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const createAdminQuick = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin user
    await User.deleteOne({ email: 'admin@experiencetech-tchad.com' });
    console.log('🗑️ Ancien utilisateur admin supprimé');

    // Create new admin user
    const password = 'admin123';
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Expérience Tech',
      email: 'admin@experiencetech-tchad.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
      phone: '+23560290510',
      address: {
        street: 'Avenue Mareshal Idriss Deby Itno',
        city: 'Abéché',
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
    console.log(`🔒 Test mot de passe: ${isPasswordValid ? '✅ Réussi' : '❌ Échec'}`);
    
    console.log('\n🎉 COMPTE ADMINISTRATEUR CRÉÉ AVEC SUCCÈS !');
    console.log('='.repeat(60));
    
    console.log('\n👤 Informations de connexion:');
    console.log('   📧 Email: admin@experiencetech-tchad.com');
    console.log('   🔑 Mot de passe: admin123');
    console.log('   👤 Nom: Admin Expérience Tech');
    console.log('   👑 Rôle: administrateur');
    console.log('   ✅ Statut: actif');
    console.log('   🔐 Email vérifié: oui');
    
    console.log('\n🎯 URLs d\'accès:');
    console.log('   🌐 Site: http://localhost:3000');
    console.log('   🔐 Connexion: http://localhost:3000/login');
    console.log('   📊 Dashboard: http://localhost:3000/dashboard');
    console.log('   👑 Admin: http://localhost:3000/admin');
    
    console.log('\n🔐 Privilèges administrateur:');
    console.log('   ✅ Accès complet à la plateforme');
    console.log('   ✅ Gestion des utilisateurs');
    console.log('   ✅ Gestion des cours et formations');
    console.log('   ✅ Gestion des services');
    console.log('   ✅ Accès au tableau de bord admin');
    console.log('   ✅ Gestion des paiements');
    console.log('   ✅ Gestion des carrières');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createAdminQuick();
