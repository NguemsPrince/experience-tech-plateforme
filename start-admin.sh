#!/bin/bash

# 🚀 Script de Démarrage du Dashboard Administrateur
# Expérience Tech - Dashboard Admin

echo "🎯 Démarrage du Dashboard Administrateur Expérience Tech"
echo "=================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "📦 Installation de Node.js..."
    
    # Installer Homebrew si pas déjà installé
    if ! command -v brew &> /dev/null; then
        echo "📦 Installation de Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Installer Node.js
    echo "📦 Installation de Node.js..."
    brew install node
fi

# Vérifier si MongoDB est installé
if ! command -v mongod &> /dev/null; then
    echo "📦 Installation de MongoDB..."
    brew tap mongodb/brew
    brew install mongodb-community
fi

# Démarrer MongoDB
echo "🗄️ Démarrage de MongoDB..."
brew services start mongodb/brew/mongodb-community

# Attendre que MongoDB soit prêt
echo "⏳ Attente du démarrage de MongoDB..."
sleep 5

# Backend
echo "🔧 Configuration du Backend..."
cd backend

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    npm install
fi

# Créer l'utilisateur admin
echo "👤 Création de l'utilisateur administrateur..."
node create-admin-quick.js

# Démarrer le serveur backend
echo "🚀 Démarrage du serveur backend..."
npm start &
BACKEND_PID=$!

# Attendre que le backend soit prêt
echo "⏳ Attente du démarrage du backend..."
sleep 10

# Frontend
echo "🎨 Configuration du Frontend..."
cd ../frontend

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    npm install
fi

# Démarrer le serveur frontend
echo "🚀 Démarrage du serveur frontend..."
npm start &
FRONTEND_PID=$!

# Attendre que le frontend soit prêt
echo "⏳ Attente du démarrage du frontend..."
sleep 15

echo ""
echo "🎉 Dashboard Administrateur démarré avec succès !"
echo "=================================================="
echo ""
echo "🔐 Informations de connexion :"
echo "   📧 Email: admin@experiencetech-tchad.com"
echo "   🔑 Mot de passe: admin123"
echo ""
echo "🌐 Accès au dashboard :"
echo "   🏠 Application: http://localhost:3000"
echo "   👑 Dashboard Admin: http://localhost:3000/admin"
echo "   🔧 API Backend: http://localhost:5000"
echo ""
echo "📱 Fonctionnalités disponibles :"
echo "   👥 Gestion des utilisateurs"
echo "   📊 Statistiques en temps réel"
echo "   🎓 Gestion des formations"
echo "   🎫 Support client"
echo "   ⚙️ Paramètres système"
echo ""
echo "🛑 Pour arrêter les serveurs :"
echo "   Ctrl+C ou fermez ce terminal"
echo ""
echo "📚 Guide complet : ADMIN_SETUP_GUIDE.md"
echo ""

# Fonction de nettoyage à l'arrêt
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Serveurs arrêtés"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
echo "🔄 Serveurs en cours d'exécution... (Ctrl+C pour arrêter)"
wait
