#!/bin/bash

# 🚀 Script de Démarrage du Dashboard Admin (Mode Mock)
# Expérience Tech - Dashboard Admin sans base de données

echo "🎯 Démarrage du Dashboard Administrateur (Mode Mock)"
echo "=================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "📦 Installation de Node.js..."
    
    # Installer NVM si pas déjà installé
    if [ ! -d "$HOME/.nvm" ]; then
        echo "📦 Installation de NVM..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    fi
    
    # Charger NVM et installer Node.js
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install node
fi

# Charger NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Vérifier l'installation
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Frontend
echo "🎨 Configuration du Frontend..."
cd frontend

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    npm install
fi

# Démarrer le serveur frontend
echo "🚀 Démarrage du serveur frontend..."
echo "⏳ Le serveur démarre en arrière-plan..."
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
echo ""
echo "📱 Comptes disponibles :"
echo "   👑 Admin: admin@experiencetech-tchad.com / admin123"
echo "   👤 Démo: demo@experiencetech-tchad.com / demo123"
echo ""
echo "📚 Guide complet : MOCK_AUTH_GUIDE.md"
echo ""
echo "🔄 Serveur en cours d'exécution... (Ctrl+C pour arrêter)"
echo ""

# Fonction de nettoyage à l'arrêt
cleanup() {
    echo ""
    echo "🛑 Arrêt du serveur..."
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Serveur arrêté"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
wait
