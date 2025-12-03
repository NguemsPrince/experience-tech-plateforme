#!/bin/bash

# Script d'initialisation des fichiers .env
# Ce script crée les fichiers .env à partir des fichiers .example

echo "🚀 Initialisation des fichiers .env..."

# Backend .env
if [ ! -f "backend/.env" ]; then
  echo "📝 Création de backend/.env..."
  cp backend/env.example backend/.env
  echo "✅ backend/.env créé avec succès"
else
  echo "⚠️  backend/.env existe déjà, ignoré"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
  echo "📝 Création de frontend/.env..."
  cp frontend/env.example frontend/.env
  echo "✅ frontend/.env créé avec succès"
else
  echo "⚠️  frontend/.env existe déjà, ignoré"
fi

echo ""
echo "✅ Initialisation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Modifiez backend/.env avec vos configurations (MongoDB, JWT_SECRET, etc.)"
echo "2. Modifiez frontend/.env avec vos clés API (Stripe, Google Maps, etc.)"
echo "3. Lancez 'npm run install-all' pour installer toutes les dépendances"
echo "4. Lancez 'npm run dev' pour démarrer le serveur de développement"

