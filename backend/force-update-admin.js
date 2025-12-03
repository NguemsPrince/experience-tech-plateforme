const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const forceUpdateAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Force update admin user using direct MongoDB update
    const result = await User.updateOne(
      { email: 'admin@experiencetech-tchad.com' },
      { 
        $set: {
          firstName: 'admin',
          lastName: 'admin',
          emailVerified: true,
          isActive: true,
          role: 'admin',
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    console.log('✅ Admin user force updated successfully!');
    console.log(`📊 Documents matched: ${result.matchedCount}`);
    console.log(`📊 Documents modified: ${result.modifiedCount}`);
    
    // Verify the update
    const updatedAdmin = await User.findOne({ email: 'admin@experiencetech-tchad.com' });
    
    console.log('\n🔍 Vérification du compte admin:');
    console.log('='.repeat(50));
    console.log(`👤 Nom: ${updatedAdmin.firstName} ${updatedAdmin.lastName}`);
    console.log(`📧 Email: ${updatedAdmin.email}`);
    console.log(`👑 Rôle: ${updatedAdmin.role}`);
    console.log(`✅ Actif: ${updatedAdmin.isActive ? 'Oui' : 'Non'}`);
    console.log(`🔐 Email vérifié: ${updatedAdmin.emailVerified ? 'Oui' : 'Non'}`);
    console.log(`📱 Téléphone: ${updatedAdmin.phone}`);
    console.log(`📅 Mis à jour: ${updatedAdmin.updatedAt ? updatedAdmin.updatedAt.toLocaleString('fr-FR') : 'Non défini'}`);
    
    console.log('\n🎯 Connexion possible avec:');
    console.log('   📧 Email: admin@experiencetech-tchad.com');
    console.log('   🔑 Mot de passe: admin123');
    
  } catch (error) {
    console.error('❌ Error force updating admin:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
forceUpdateAdmin();
