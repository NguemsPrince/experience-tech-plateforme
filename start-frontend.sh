#!/bin/bash

# Script de démarrage du frontend
echo "🚀 Démarrage du frontend Expérience Tech..."

# Aller dans le dossier frontend
cd /Users/nguemsprince/Desktop/Projet/frontend

# Utiliser le Node.js local
export PATH="/Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin:$PATH"

# Démarrer le serveur de développement
echo "📡 Démarrage du serveur de développement sur le port 3000..."
/Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin/node /Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin/npm start
