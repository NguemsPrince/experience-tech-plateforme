#!/bin/bash

# Script de démarrage automatique du Dashboard Expérience Tech
# Ce script démarre tous les services nécessaires pour le tableau de bord

echo "🚀 Démarrage du Dashboard Expérience Tech..."
echo "=============================================="

# Configuration des chemins
PROJECT_DIR="/Users/nguemsprince/Desktop/Projet"
NODE_PATH="$PROJECT_DIR/node-v18.19.0-darwin-x64/bin"
MONGODB_PATH="$PROJECT_DIR/mongodb-macos-x86_64-7.0.5/bin"

# Ajouter Node.js au PATH
export PATH="$NODE_PATH:$PATH"

echo "📁 Répertoire du projet: $PROJECT_DIR"
echo "🔧 Node.js version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# Fonction pour vérifier si un port est utilisé
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $port déjà utilisé"
        return 1
    else
        echo "✅ Port $port disponible"
        return 0
    fi
}

# Fonction pour arrêter les processus existants
cleanup() {
    echo "🧹 Nettoyage des processus existants..."
    pkill -f "mongod" 2>/dev/null || true
    pkill -f "node server.js" 2>/dev/null || true
    pkill -f "react-scripts start" 2>/dev/null || true
    sleep 2
}

# Fonction pour démarrer MongoDB
start_mongodb() {
    echo "🗄️  Démarrage de MongoDB..."
    
    if check_port 27017; then
        cd "$PROJECT_DIR"
        $MONGODB_PATH/mongod --dbpath ./data --port 27017 --logpath ./mongodb.log &
        sleep 3
        
        if check_port 27017; then
            echo "✅ MongoDB démarré avec succès"
            return 0
        else
            echo "❌ Échec du démarrage de MongoDB"
            return 1
        fi
    else
        echo "✅ MongoDB déjà en cours d'exécution"
        return 0
    fi
}

# Fonction pour démarrer le backend
start_backend() {
    echo "🔧 Démarrage du backend..."
    
    if check_port 5000; then
        cd "$PROJECT_DIR/backend"
        npm start &
        sleep 5
        
        if check_port 5000; then
            echo "✅ Backend démarré avec succès"
            return 0
        else
            echo "❌ Échec du démarrage du backend"
            return 1
        fi
    else
        echo "✅ Backend déjà en cours d'exécution"
        return 0
    fi
}

# Fonction pour démarrer le frontend
start_frontend() {
    echo "🎨 Démarrage du frontend..."
    
    if check_port 3000; then
        cd "$PROJECT_DIR/frontend"
        npm start &
        sleep 10
        
        if check_port 3000; then
            echo "✅ Frontend démarré avec succès"
            return 0
        else
            echo "❌ Échec du démarrage du frontend"
            return 1
        fi
    else
        echo "✅ Frontend déjà en cours d'exécution"
        return 0
    fi
}

# Fonction pour tester les services
test_services() {
    echo "🧪 Test des services..."
    
    # Test MongoDB
    if curl -s "http://localhost:27017" >/dev/null 2>&1; then
        echo "✅ MongoDB accessible"
    else
        echo "⚠️  MongoDB non accessible via HTTP (normal)"
    fi
    
    # Test Backend
    if curl -s "http://localhost:5000/api/health" >/dev/null 2>&1; then
        echo "✅ Backend API accessible"
    else
        echo "❌ Backend API non accessible"
        return 1
    fi
    
    # Test Frontend
    if curl -s "http://localhost:3000" >/dev/null 2>&1; then
        echo "✅ Frontend accessible"
    else
        echo "❌ Frontend non accessible"
        return 1
    fi
    
    return 0
}

# Fonction pour ouvrir le dashboard
open_dashboard() {
    echo "🌐 Ouverture du dashboard..."
    sleep 2
    open "http://localhost:3000/admin" 2>/dev/null || echo "⚠️  Impossible d'ouvrir automatiquement le navigateur"
    open "http://localhost:3000/login" 2>/dev/null || echo "⚠️  Impossible d'ouvrir automatiquement le navigateur"
    open "$PROJECT_DIR/test-dashboard-complet.html" 2>/dev/null || echo "⚠️  Impossible d'ouvrir le fichier de test"
}

# Fonction principale
main() {
    echo "🔄 Nettoyage initial..."
    cleanup
    
    echo ""
    echo "🚀 Démarrage des services..."
    echo "============================="
    
    # Démarrer MongoDB
    if ! start_mongodb; then
        echo "❌ Impossible de démarrer MongoDB. Arrêt du script."
        exit 1
    fi
    
    # Démarrer le backend
    if ! start_backend; then
        echo "❌ Impossible de démarrer le backend. Arrêt du script."
        exit 1
    fi
    
    # Démarrer le frontend
    if ! start_frontend; then
        echo "❌ Impossible de démarrer le frontend. Arrêt du script."
        exit 1
    fi
    
    echo ""
    echo "🧪 Test des services..."
    echo "======================"
    
    if test_services; then
        echo ""
        echo "🎉 Tous les services sont opérationnels !"
        echo "========================================"
        echo "📊 Dashboard Admin: http://localhost:3000/admin"
        echo "🔐 Page de connexion: http://localhost:3000/login"
        echo "🧪 Test complet: $PROJECT_DIR/test-dashboard-complet.html"
        echo ""
        
        # Ouvrir le dashboard
        open_dashboard
        
        echo "✅ Dashboard Expérience Tech prêt à l'utilisation !"
        echo ""
        echo "📝 Pour arrêter les services, utilisez Ctrl+C ou fermez ce terminal"
        echo "🔄 Pour redémarrer, relancez ce script"
        
        # Garder le script en vie
        echo ""
        echo "⏳ Services en cours d'exécution... (Ctrl+C pour arrêter)"
        while true; do
            sleep 30
            echo "💓 Services actifs - $(date)"
        fi
        
    else
        echo "❌ Certains services ne sont pas opérationnels"
        echo "🔍 Vérifiez les logs ci-dessus pour plus de détails"
        exit 1
    fi
}

# Gestion des signaux pour arrêter proprement
trap 'echo ""; echo "🛑 Arrêt des services..."; cleanup; echo "✅ Services arrêtés"; exit 0' INT TERM

# Exécution du script principal
main
