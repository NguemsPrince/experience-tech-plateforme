const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@experiencetech-tchad.com' },
        { firstName: 'admin', lastName: 'admin' }
      ]
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.firstName, existingAdmin.lastName);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Create admin user with username "admin"
    const adminUser = new User({
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@experiencetech-tchad.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      emailVerified: true,
      phone: '+23560290510',
      address: {
        street: 'Avenue Charles de Gaulle',
        city: 'N\'Djamena',
        country: 'Tchad',
        postalCode: '0000'
      },
      profile: {
        bio: 'Administrateur système de la plateforme Expérience Tech',
        avatar: null,
        website: 'https://experiencetech-tchad.com'
      },
      preferences: {
        language: 'fr',
        timezone: 'Africa/Ndjamena',
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      },
      lastLogin: new Date(),
      loginCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save admin user
    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('👤 Username: admin');
    console.log('📧 Email: admin@experiencetech-tchad.com');
    console.log('🔒 Password: admin123');
    console.log('👑 Role: admin');
    console.log('✅ Status: Active');
    console.log('📱 Phone: +23560290510');
    console.log('🌍 Location: N\'Djamena, Tchad');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createAdminUser();
