#!/bin/bash

echo "🚀 Démarrage du Backend Expérience Tech"
echo "========================================"

# Aller dans le dossier backend
cd /Users/nguemsprince/Desktop/Projet/backend

# Tuer les processus existants sur le port 5000
echo "🔄 Libération du port 5000..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Attendre un peu
sleep 2

# Démarrer le serveur
echo "📡 Démarrage du serveur..."
/Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin/node server.js

echo "✅ Backend démarré sur http://localhost:5000"
