#!/bin/bash

# Script de démarrage du système de tickets Expérience Tech
# Ce script initialise et démarre le système de tickets avec intégration Freshdesk

echo "🎫 Démarrage du Système de Tickets Expérience Tech"
echo "=================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Vérifier si MongoDB est installé
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB n'est pas installé. Veuillez installer MongoDB d'abord."
    echo "   Vous pouvez télécharger MongoDB depuis: https://www.mongodb.com/try/download/community"
fi

echo "✅ Node.js détecté: $(node --version)"
echo "✅ NPM détecté: $(npm --version)"

# Aller dans le dossier backend
cd backend

echo ""
echo "📦 Installation des dépendances backend..."
npm install

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  Fichier .env non trouvé. Création d'un fichier .env d'exemple..."
    cat > .env << EOF
# Configuration de base
NODE_ENV=development
PORT=5000

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/experience_tech

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRE=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Freshdesk Integration (Optionnel)
FRESHDESK_API_KEY=your_freshdesk_api_key
FRESHDESK_DOMAIN=your_freshdesk_domain

# Email Configuration (Optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EOF
    echo "✅ Fichier .env créé. Veuillez le configurer avec vos paramètres."
fi

echo ""
echo "🗄️  Initialisation des catégories de tickets..."
node initialize-ticket-categories.js

echo ""
echo "🧪 Test de l'intégration Freshdesk (optionnel)..."
echo "   Si vous avez configuré Freshdesk, le test va s'exécuter..."
node test-freshdesk-integration.js

echo ""
echo "🚀 Démarrage du serveur backend..."
echo "   Le serveur va démarrer sur http://localhost:5000"
echo "   Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrer le serveur
npm run server
