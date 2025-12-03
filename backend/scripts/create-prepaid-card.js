#!/usr/bin/env node

/**
 * Script pour créer des cartes prépayées
 * Usage: node create-prepaid-card.js <value> [prefix] [expiresAt]
 * Exemple: node create-prepaid-card.js 100000
 * Exemple: node create-prepaid-card.js 50000 EXP 2025-12-31
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import du modèle PrepaidCard
const PrepaidCard = require('../models/PrepaidCard');

// Configuration de la base de données
const connectDB = async () => {
  try {
    const mongoUri = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_TEST_URI 
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/experience-tech';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion à MongoDB réussie\n');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

// Fonction pour créer une carte prépayée
const createPrepaidCard = async (value, prefix = 'EXP', expiresAt = null) => {
  try {
    // Validation de la valeur
    if (!value || value <= 0) {
      throw new Error('La valeur doit être un nombre positif');
    }

    // Générer un code unique
    const code = PrepaidCard.generateCode(prefix);
    
    console.log('🔄 Création de la carte prépayée...');
    
    // Créer la carte
    const cardData = {
      code: code,
      value: value,
      currency: 'XAF',
      status: 'active'
    };

    if (expiresAt) {
      cardData.expiresAt = new Date(expiresAt);
    }

    const card = new PrepaidCard(cardData);
    await card.save();
    
    console.log('✅ Carte prépayée créée avec succès !\n');
    console.log('📋 Détails de la carte :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Code              : ${card.code}`);
    console.log(`Valeur            : ${card.value.toLocaleString('fr-FR')} FCFA`);
    console.log(`Statut            : ${card.status}`);
    if (card.expiresAt) {
      console.log(`Expiration        : ${card.expiresAt.toLocaleDateString('fr-FR')}`);
    }
    console.log(`Date de création  : ${card.createdAt.toLocaleString('fr-FR')}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Utilisez ce code dans le processus de paiement.');
    
    return card;
  } catch (error) {
    console.error('❌ Erreur lors de la création de la carte prépayée:', error.message);
    throw error;
  }
};

// Fonction principale
const main = async () => {
  console.log('🚀 Création d\'une carte prépayée\n');

  // Récupérer les arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Usage: node create-prepaid-card.js <value> [prefix] [expiresAt]');
    console.error('   Exemple: node create-prepaid-card.js 100000');
    console.error('   Exemple: node create-prepaid-card.js 50000 EXP');
    console.error('   Exemple: node create-prepaid-card.js 50000 EXP 2025-12-31');
    process.exit(1);
  }

  const value = parseFloat(args[0]);
  const prefix = args[1] || 'EXP';
  const expiresAt = args[2] || null;

  await connectDB();
  await createPrepaidCard(value, prefix, expiresAt);
  await mongoose.connection.close();
  console.log('\n✅ Processus terminé');
};

// Exécuter le script
main().catch(error => {
  console.error('\n❌ Erreur fatale:', error.message);
  process.exit(1);
});


