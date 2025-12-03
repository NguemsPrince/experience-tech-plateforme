#!/bin/bash

# Script de démarrage du forum Expérience Tech
# Ce script initialise les catégories du forum et démarre les services

echo "🚀 Démarrage du Forum Expérience Tech"
echo "======================================"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si MongoDB est en cours d'exécution
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB ne semble pas être en cours d'exécution."
    echo "   Veuillez démarrer MongoDB avant de continuer."
    echo "   Sur macOS avec Homebrew: brew services start mongodb-community"
    echo "   Sur Ubuntu: sudo systemctl start mongod"
    echo ""
    read -p "Voulez-vous continuer quand même ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Aller dans le répertoire backend
cd backend

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    npm install
fi

# Initialiser les catégories du forum
echo "🏷️  Initialisation des catégories du forum..."
npm run init:forum

if [ $? -eq 0 ]; then
    echo "✅ Catégories du forum initialisées avec succès !"
else
    echo "❌ Erreur lors de l'initialisation des catégories"
    exit 1
fi

# Retourner au répertoire racine
cd ..

# Aller dans le répertoire frontend
cd frontend

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    npm install
fi

# Retourner au répertoire racine
cd ..

echo ""
echo "🎉 Initialisation terminée !"
echo ""
echo "Pour démarrer le forum :"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "Ou utilisez le script de démarrage complet :"
echo "npm run dev"
echo ""
echo "📚 Documentation du forum :"
echo "- Forum principal: http://localhost:3000/forum"
echo "- Administration: http://localhost:3000/forum/admin"
echo "- API: http://localhost:5000/api/forum"
echo ""
echo "🔧 Fonctionnalités disponibles :"
echo "✅ Création de sujets avec catégories et tags"
echo "✅ Système de commentaires et réponses"
echo "✅ Likes/dislikes et signalements"
echo "✅ Recherche et filtres avancés"
echo "✅ Interface d'administration pour la modération"
echo "✅ Design responsive et moderne"
echo ""
echo "Bon développement ! 🚀"
