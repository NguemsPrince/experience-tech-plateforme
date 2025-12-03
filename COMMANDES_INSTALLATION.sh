#!/bin/bash

#############################################################################
# Script d'installation et de configuration - Expérience Tech 2.0
# Ce script installe toutes les dépendances nécessaires et configure le projet
#############################################################################

echo "🚀 Installation d'Expérience Tech 2.0 - Améliorations Professionnelles"
echo "========================================================================"
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher un message de succès
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher un message d'information
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Fonction pour afficher un message d'avertissement
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Fonction pour afficher un message d'erreur
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier Node.js
echo ""
info "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
success "Node.js installé: $NODE_VERSION"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    error "npm n'est pas installé."
    exit 1
fi
NPM_VERSION=$(npm -v)
success "npm installé: $NPM_VERSION"

# Étape 1: Installer les dépendances Frontend
echo ""
echo "📦 Étape 1/4: Installation des dépendances Frontend"
echo "---------------------------------------------------"
cd frontend || exit 1

info "Installation de Zod et des resolvers..."
npm install zod @hookform/resolvers --legacy-peer-deps
if [ $? -eq 0 ]; then
    success "Zod et resolvers installés avec succès"
else
    error "Erreur lors de l'installation de Zod"
    exit 1
fi

info "Installation de lodash.debounce..."
npm install lodash.debounce --legacy-peer-deps
if [ $? -eq 0 ]; then
    success "lodash.debounce installé avec succès"
else
    error "Erreur lors de l'installation de lodash.debounce"
    exit 1
fi

cd ..

# Étape 2: Vérifier MongoDB
echo ""
echo "🗄️  Étape 2/4: Vérification de MongoDB"
echo "--------------------------------------"

if [ ! -d "mongodb-macos-x86_64-7.0.5" ]; then
    warning "MongoDB n'est pas installé dans le dossier du projet"
    warning "Assurez-vous que MongoDB est installé et accessible"
else
    success "MongoDB trouvé dans le projet"
    
    # Créer le dossier de données si nécessaire
    if [ ! -d "mongodb-data" ]; then
        mkdir -p mongodb-data
        success "Dossier mongodb-data créé"
    fi
    
    # Vérifier si MongoDB est déjà lancé
    if pgrep -x "mongod" > /dev/null; then
        warning "MongoDB est déjà en cours d'exécution"
    else
        info "Démarrage de MongoDB..."
        ./mongodb-macos-x86_64-7.0.5/bin/mongod --dbpath ./mongodb-data --logpath ./mongodb.log --fork
        if [ $? -eq 0 ]; then
            success "MongoDB démarré avec succès"
        else
            error "Erreur lors du démarrage de MongoDB"
        fi
    fi
fi

# Étape 3: Configuration des variables d'environnement
echo ""
echo "⚙️  Étape 3/4: Configuration des variables d'environnement"
echo "---------------------------------------------------------"

# Backend .env
if [ ! -f "backend/.env" ]; then
    info "Création du fichier backend/.env..."
    cat > backend/.env << 'EOF'
# Base de données
MONGODB_URI=mongodb://localhost:27017/experience_tech
NODE_ENV=development

# JWT
JWT_SECRET=experience_tech_secret_jwt_super_securise_2025
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=experience_tech_refresh_secret_super_securise_2025
JWT_REFRESH_EXPIRE=30d

# Serveur
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    success "Fichier backend/.env créé"
else
    warning "Le fichier backend/.env existe déjà (non modifié)"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    info "Création du fichier frontend/.env..."
    cat > frontend/.env << 'EOF'
# API
REACT_APP_API_URL=http://localhost:5000/api

# Mode
REACT_APP_ENV=development

# Génération de source maps (désactivé pour la performance)
GENERATE_SOURCEMAP=false
EOF
    success "Fichier frontend/.env créé"
else
    warning "Le fichier frontend/.env existe déjà (non modifié)"
fi

# Étape 4: Créer un utilisateur admin
echo ""
echo "👤 Étape 4/4: Création de l'utilisateur administrateur"
echo "------------------------------------------------------"

cd backend || exit 1

if [ -f "create-admin-quick.js" ]; then
    info "Création de l'utilisateur admin..."
    node create-admin-quick.js
    if [ $? -eq 0 ]; then
        success "Utilisateur admin créé avec succès"
        echo ""
        echo "📧 Identifiants admin:"
        echo "   Email: admin@experiencetech.td"
        echo "   Mot de passe: Admin123"
    else
        warning "Impossible de créer l'admin (peut-être déjà existant)"
    fi
else
    warning "Script create-admin-quick.js non trouvé"
fi

cd ..

# Résumé final
echo ""
echo "========================================================================"
echo "🎉 Installation terminée avec succès !"
echo "========================================================================"
echo ""
echo "📋 Prochaines étapes:"
echo ""
echo "1. Démarrer l'application:"
echo "   ${BLUE}npm run dev${NC}"
echo ""
echo "2. Accéder à l'application:"
echo "   Frontend: ${BLUE}http://localhost:3000${NC}"
echo "   Backend:  ${BLUE}http://localhost:5000${NC}"
echo ""
echo "3. Se connecter avec:"
echo "   Email:        ${BLUE}admin@experiencetech.td${NC}"
echo "   Mot de passe: ${BLUE}Admin123${NC}"
echo ""
echo "📚 Documentation disponible:"
echo "   - ${BLUE}README.md${NC} - Vue d'ensemble"
echo "   - ${BLUE}AMELIORATIONS_PROFESSIONNELLES_2025.md${NC} - Guide complet"
echo "   - ${BLUE}GUIDE_INSTALLATION_COMPLETE.md${NC} - Installation détaillée"
echo "   - ${BLUE}RECAPITULATIF_AMELIORATIONS.md${NC} - Récapitulatif rapide"
echo ""
echo "🚀 Votre plateforme Expérience Tech 2.0 est prête !"
echo ""

