const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

const showAdminSummary = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get admin user
    const adminUser = await User.findOne({ email: 'admin@experiencetech-tchad.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('\n🎉 COMPTE ADMINISTRATEUR CRÉÉ AVEC SUCCÈS !');
    console.log('='.repeat(60));
    
    console.log('\n👤 Informations du compte:');
    console.log('   📧 Email: admin@experiencetech-tchad.com');
    console.log('   🔑 Mot de passe: admin123');
    console.log('   👤 Nom d\'utilisateur: admin');
    console.log('   👑 Rôle: administrateur');
    console.log('   ✅ Statut: actif');
    console.log('   🔐 Email vérifié: oui');
    console.log('   📱 Téléphone: +23560290510');
    console.log('   🌍 Localisation: N\'Djamena, Tchad');
    
    console.log('\n🎯 Comment se connecter:');
    console.log('   1. Allez sur la page de connexion');
    console.log('   2. Entrez l\'email: admin@experiencetech-tchad.com');
    console.log('   3. Entrez le mot de passe: admin123');
    console.log('   4. Cliquez sur "Se connecter"');
    
    console.log('\n🔐 Privilèges administrateur:');
    console.log('   ✅ Accès complet à la plateforme');
    console.log('   ✅ Gestion des utilisateurs');
    console.log('   ✅ Gestion des cours et formations');
    console.log('   ✅ Gestion des services');
    console.log('   ✅ Accès au tableau de bord admin');
    console.log('   ✅ Gestion des paiements');
    console.log('   ✅ Gestion des carrières');
    
    console.log('\n📊 Statistiques de la base de données:');
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    
    console.log(`   👥 Total utilisateurs: ${totalUsers}`);
    console.log(`   👑 Administrateurs: ${adminUsers}`);
    console.log(`   ✅ Utilisateurs actifs: ${activeUsers}`);
    console.log(`   🔐 Emails vérifiés: ${verifiedUsers}`);
    
    console.log('\n✅ Le compte administrateur est prêt à être utilisé !');
    console.log('🎉 Vous pouvez maintenant vous connecter à la plateforme Expérience Tech');
    
  } catch (error) {
    console.error('❌ Error showing admin summary:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
showAdminSummary();
