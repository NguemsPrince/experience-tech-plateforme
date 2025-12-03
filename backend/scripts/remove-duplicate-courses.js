require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');

const removeDuplicates = async () => {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/experience_tech';
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Trouver tous les cours
    const courses = await Course.find({});
    console.log(`📊 Total de cours trouvés: ${courses.length}`);

    // Grouper par titre (insensible à la casse)
    const coursesByTitle = {};
    courses.forEach(course => {
      const titleKey = course.title.toLowerCase().trim();
      if (!coursesByTitle[titleKey]) {
        coursesByTitle[titleKey] = [];
      }
      coursesByTitle[titleKey].push(course);
    });

    // Trouver les doublons
    const duplicates = {};
    Object.keys(coursesByTitle).forEach(titleKey => {
      if (coursesByTitle[titleKey].length > 1) {
        duplicates[titleKey] = coursesByTitle[titleKey];
      }
    });

    console.log(`\n🔍 Doublons trouvés: ${Object.keys(duplicates).length}`);
    
    let totalDeleted = 0;

    // Supprimer les doublons (garder le premier, supprimer les autres)
    for (const titleKey in duplicates) {
      const duplicateCourses = duplicates[titleKey];
      console.log(`\n📝 Formation: "${duplicateCourses[0].title}"`);
      console.log(`   Nombre de copies: ${duplicateCourses.length}`);
      
      // Trier par date de création (garder le plus ancien)
      duplicateCourses.sort((a, b) => {
        const dateA = a.createdAt || a._id.getTimestamp();
        const dateB = b.createdAt || b._id.getTimestamp();
        return dateA - dateB;
      });

      // Garder le premier, supprimer les autres
      const toKeep = duplicateCourses[0];
      const toDelete = duplicateCourses.slice(1);

      console.log(`   ✅ Garder: ${toKeep._id} (créé le ${toKeep.createdAt || toKeep._id.getTimestamp()})`);
      
      for (const course of toDelete) {
        console.log(`   ❌ Supprimer: ${course._id} (créé le ${course.createdAt || course._id.getTimestamp()})`);
        await Course.findByIdAndDelete(course._id);
        totalDeleted++;
      }
    }

    console.log(`\n✅ Suppression terminée!`);
    console.log(`   Total de cours supprimés: ${totalDeleted}`);
    console.log(`   Cours restants: ${courses.length - totalDeleted}`);

    // Vérification finale
    const remainingCourses = await Course.find({});
    console.log(`\n📊 Vérification finale: ${remainingCourses.length} cours restants`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

// Exécuter le script
removeDuplicates();

