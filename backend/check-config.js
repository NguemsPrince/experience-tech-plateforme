require('dotenv').config();

console.log('🔍 Vérification de la configuration...');
console.log('=' .repeat(50));

console.log('📋 Variables d\'environnement :');
console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'non défini'}`);
console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? 'défini' : 'NON DÉFINI'}`);
console.log(`   - JWT_EXPIRE: ${process.env.JWT_EXPIRE || 'non défini'}`);
console.log(`   - MONGODB_URI: ${process.env.MONGODB_URI ? 'défini' : 'NON DÉFINI'}`);
console.log(`   - BCRYPT_SALT_ROUNDS: ${process.env.BCRYPT_SALT_ROUNDS || 'non défini'}`);

if (!process.env.JWT_SECRET) {
  console.log('\n❌ PROBLÈME: JWT_SECRET n\'est pas défini !');
  console.log('💡 Solution: Ajoutez JWT_SECRET dans votre fichier .env');
} else {
  console.log('\n✅ JWT_SECRET est défini');
}

console.log('\n🔧 Configuration recommandée pour .env :');
console.log('JWT_SECRET=your-super-secret-jwt-key-here');
console.log('JWT_EXPIRE=7d');
console.log('MONGODB_URI=mongodb://localhost:27017/experience-tech');
console.log('BCRYPT_SALT_ROUNDS=12');
