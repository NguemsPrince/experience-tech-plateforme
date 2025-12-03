#!/bin/bash

echo "🚀 Démarrage de la Plateforme Expérience Tech"
echo "=============================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour vérifier si un port est utilisé
check_port() {
    if lsof -ti:$1 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Vérifier MongoDB
echo "📦 Vérification de MongoDB..."
if check_port 27017; then
    echo -e "${GREEN}✅ MongoDB est déjà en cours d'exécution${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB n'est pas démarré${NC}"
    echo "   Démarrez MongoDB manuellement si nécessaire"
fi
echo ""

# Vérifier et démarrer le Backend
echo "🔧 Vérification du Backend..."
if check_port 5000; then
    echo -e "${GREEN}✅ Backend est déjà en cours d'exécution sur http://localhost:5000${NC}"
    BACKEND_RUNNING=true
else
    echo "📡 Démarrage du Backend..."
    cd "$(dirname "$0")/backend"
    
    # Charger les variables d'environnement
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    # Démarrer le backend en arrière-plan
    if [ -f "../node-v18.19.0-darwin-x64/bin/node" ]; then
        ../node-v18.19.0-darwin-x64/bin/node server.js > ../backend.log 2>&1 &
        BACKEND_PID=$!
        echo "   Backend démarré (PID: $BACKEND_PID)"
        BACKEND_RUNNING=false
    else
        echo -e "${RED}❌ Node.js non trouvé${NC}"
        exit 1
    fi
    
    # Attendre que le backend soit prêt
    echo "   Attente du démarrage du backend..."
    for i in {1..10}; do
        sleep 1
        if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend démarré avec succès${NC}"
            BACKEND_RUNNING=true
            break
        fi
    done
    
    if [ "$BACKEND_RUNNING" = false ]; then
        echo -e "${YELLOW}⚠️  Le backend prend du temps à démarrer...${NC}"
    fi
    
    cd ..
fi
echo ""

# Vérifier le Frontend
echo "🎨 Vérification du Frontend..."
if check_port 3000; then
    echo -e "${GREEN}✅ Frontend est déjà en cours d'exécution sur http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend n'est pas démarré${NC}"
    echo "   Pour démarrer le frontend, exécutez :"
    echo "   cd frontend && npm start"
fi
echo ""

# Résumé
echo "=============================================="
echo "📊 État de la Plateforme"
echo "=============================================="
echo ""
echo "MongoDB:"
if check_port 27017; then
    echo -e "  ${GREEN}✅ Port 27017${NC}"
else
    echo -e "  ${RED}❌ Non démarré${NC}"
fi

echo ""
echo "Backend:"
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅ http://localhost:5000${NC}"
    echo "  Health check: OK"
else
    echo -e "  ${RED}❌ Non accessible${NC}"
fi

echo ""
echo "Frontend:"
if check_port 3000; then
    echo -e "  ${GREEN}✅ http://localhost:3000${NC}"
else
    echo -e "  ${RED}❌ Non démarré${NC}"
fi

echo ""
echo "=============================================="
echo ""
echo "🌐 Accès à la plateforme :"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Admin Login: http://localhost:3000/admin/login"
echo ""
echo "📝 Logs du backend: backend.log"
echo ""

