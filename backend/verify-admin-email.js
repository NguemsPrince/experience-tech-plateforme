const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const verifyAdminEmail = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find and update the admin user
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@experiencetech-tchad.com' },
      { 
        emailVerified: true,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    console.log('✅ Admin email verified successfully!');
    console.log('👤 Username: admin');
    console.log('📧 Email: admin@experiencetech-tchad.com');
    console.log('🔒 Password: admin123');
    console.log('👑 Role: admin');
    console.log('✅ Status: Active');
    console.log('🔐 Email verified: Yes');
    console.log('📱 Phone: +23560290510');
    
    console.log('\n🎯 Connexion possible avec:');
    console.log('   📧 Email: admin@experiencetech-tchad.com');
    console.log('   🔑 Mot de passe: admin123');
    
  } catch (error) {
    console.error('❌ Error verifying admin email:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
verifyAdminEmail();
