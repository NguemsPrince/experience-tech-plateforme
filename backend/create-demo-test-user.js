require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createDemoUser = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'demo@test.com' });
    
    if (existingUser) {
      console.log('⚠️  L\'utilisateur demo existe déjà. Suppression...');
      await User.deleteOne({ email: 'demo@test.com' });
      console.log('✅ Ancien utilisateur supprimé');
    }

    // Create new demo user
    const demoUser = await User.create({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@test.com',
      password: 'demo123',
      phone: '+237600000000',
      role: 'client',
      isActive: true,
      emailVerified: true,
      company: {
        name: 'Demo Company',
        position: 'Test User'
      },
      address: {
        street: '123 Demo Street',
        city: 'Yaoundé',
        country: 'Cameroon'
      },
      preferences: {
        language: 'fr',
        notifications: {
          email: true,
          sms: false
        }
      }
    });

    console.log('\n✅ Utilisateur demo créé avec succès!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: demo@test.com');
    console.log('🔑 Mot de passe: demo123');
    console.log('👤 Rôle: client');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎯 Utilisez ces identifiants pour tester:');
    console.log('   - Page de test: test-dashboard-access.html');
    console.log('   - Interface web: http://localhost:3000/login');
    console.log('   - API: http://localhost:5000/api/auth/login');
    
    mongoose.connection.close();
    console.log('\n✅ Connexion MongoDB fermée');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`   - ${key}: ${error.errors[key].message}`);
      });
    }
    mongoose.connection.close();
    process.exit(1);
  }
};

console.log('\n🚀 Création de l\'utilisateur de démonstration...\n');
createDemoUser();

