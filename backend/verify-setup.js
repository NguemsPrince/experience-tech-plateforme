require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const verifySetup = async () => {
  console.log('\n🔍 Vérification de la Configuration du Dashboard\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 1. Connexion à MongoDB
    console.log('1️⃣  Connexion à MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('   ✅ MongoDB connecté : ' + mongoUri + '\n');

    // 2. Vérifier l'utilisateur demo
    console.log('2️⃣  Vérification de l\'utilisateur demo...');
    const demoUser = await User.findOne({ email: 'demo@test.com' });
    if (demoUser) {
      console.log('   ✅ Utilisateur demo trouvé');
      console.log('   📧 Email : demo@test.com');
      console.log('   👤 Nom : ' + demoUser.firstName + ' ' + demoUser.lastName);
      console.log('   🎭 Rôle : ' + demoUser.role);
      console.log('   🟢 Actif : ' + (demoUser.isActive ? 'Oui' : 'Non'));
      console.log('   📅 Créé le : ' + demoUser.createdAt.toLocaleDateString('fr-FR') + '\n');
    } else {
      console.log('   ❌ Utilisateur demo non trouvé');
      console.log('   💡 Exécutez : node create-demo-test-user.js\n');
    }

    // 3. Vérifier JWT_SECRET
    console.log('3️⃣  Vérification des variables d\'environnement...');
    if (process.env.JWT_SECRET) {
      console.log('   ✅ JWT_SECRET configuré');
    } else {
      console.log('   ⚠️  JWT_SECRET non défini dans .env');
    }
    
    if (process.env.JWT_EXPIRE) {
      console.log('   ✅ JWT_EXPIRE : ' + process.env.JWT_EXPIRE);
    } else {
      console.log('   ⚠️  JWT_EXPIRE non défini (utilise valeur par défaut)');
    }
    
    console.log('   ✅ PORT : ' + (process.env.PORT || 5000));
    console.log('   ✅ NODE_ENV : ' + (process.env.NODE_ENV || 'development') + '\n');

    // 4. Statistiques de la base de données
    console.log('4️⃣  Statistiques de la base de données...');
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const clients = await User.countDocuments({ role: 'client' });
    const admins = await User.countDocuments({ role: 'admin' });
    
    console.log('   👥 Total utilisateurs : ' + totalUsers);
    console.log('   🟢 Utilisateurs actifs : ' + activeUsers);
    console.log('   👔 Clients : ' + clients);
    console.log('   ⭐ Administrateurs : ' + admins + '\n');

    // 5. Résumé
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 RÉSUMÉ\n');
    
    if (demoUser && process.env.JWT_SECRET) {
      console.log('✅ Tout est configuré correctement !\n');
      console.log('🚀 Prochaines étapes :');
      console.log('   1. Assurez-vous que le serveur backend tourne (port 5000)');
      console.log('   2. Ouvrez test-dashboard-access.html dans votre navigateur');
      console.log('   3. Cliquez sur "Tester la Connexion"');
      console.log('   4. Cliquez sur "Tester le Dashboard"\n');
      console.log('📝 Identifiants de test :');
      console.log('   Email : demo@test.com');
      console.log('   Mot de passe : demo123\n');
    } else {
      console.log('⚠️  Configuration incomplète\n');
      if (!demoUser) {
        console.log('   ❌ Créez l\'utilisateur demo : node create-demo-test-user.js');
      }
      if (!process.env.JWT_SECRET) {
        console.log('   ❌ Configurez JWT_SECRET dans le fichier .env');
      }
      console.log('');
    }

    mongoose.connection.close();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Erreur :', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

verifySetup();

