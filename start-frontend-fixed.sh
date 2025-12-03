#!/bin/bash

# Script pour démarrer le frontend avec le bon PATH Node.js
# Usage: ./start-frontend-fixed.sh

echo "🚀 Démarrage du frontend avec Node.js local..."

# Définir le PATH pour utiliser Node.js local
export PATH="/Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin:$PATH"

# Vérifier que Node.js et npm sont disponibles
echo "📋 Vérification des outils..."
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Aller dans le dossier frontend
cd /Users/nguemsprince/Desktop/Projet/frontend

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrer le serveur de développement React
echo "🌟 Démarrage du serveur de développement React..."
echo "📱 L'application sera disponible sur: http://localhost:3000"
echo "🔧 Dashboard Admin: http://localhost:3000/admin"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Utiliser react-scripts directement pour éviter les conflits
npx react-scripts start