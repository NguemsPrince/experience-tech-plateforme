#!/bin/bash

# Script de démarrage pour le Dashboard Moderne - Expérience Tech
# Ce script démarre le serveur de développement avec les configurations optimisées

echo "🚀 Démarrage du Dashboard Moderne - Expérience Tech"
echo "=================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Aller dans le dossier frontend
cd frontend

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier si le fichier .env existe
if [ ! -f ".env" ]; then
    echo "⚙️  Création du fichier .env..."
    cp env.example .env
    echo "✅ Fichier .env créé. Veuillez le configurer selon vos besoins."
fi

# Démarrer le serveur de développement
echo "🎯 Démarrage du serveur de développement..."
echo ""
echo "📱 Dashboard Moderne: http://localhost:3000/admin"
echo "📊 Version Legacy: http://localhost:3000/admin/legacy"
echo "🎪 Démonstration: http://localhost:3000/demo"
echo ""
echo "✨ Fonctionnalités disponibles:"
echo "   • Mode sombre natif"
echo "   • Sidebar collapsible"
echo "   • Graphiques interactifs"
echo "   • Notifications en temps réel"
echo "   • Actions rapides"
echo "   • Design responsive"
echo ""
echo "🛑 Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrer avec les variables d'environnement optimisées
REACT_APP_DASHBOARD_MODE=modern \
REACT_APP_ENABLE_ANIMATIONS=true \
REACT_APP_ENABLE_DARK_MODE=true \
REACT_APP_ENABLE_NOTIFICATIONS=true \
npm start
