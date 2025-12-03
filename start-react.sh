#!/bin/bash

# Script simple pour démarrer le frontend React
# Usage: ./start-react.sh

echo "🚀 Démarrage du frontend React..."

# Définir le PATH pour utiliser Node.js local
export PATH="/Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin:$PATH"

# Vérifier que Node.js et npm sont disponibles
echo "📋 Vérification des outils..."
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Aller dans le dossier frontend
cd /Users/nguemsprince/Desktop/Projet/frontend

echo "📁 Dossier de travail: $(pwd)"

# Démarrer le serveur de développement React
echo "🌟 Démarrage du serveur de développement React..."
echo "📱 L'application sera disponible sur: http://localhost:3000"
echo "🔧 Dashboard Admin: http://localhost:3000/admin"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Utiliser react-scripts directement
npx react-scripts start

