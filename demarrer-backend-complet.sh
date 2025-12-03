#!/bin/bash

# 🚀 Script de Démarrage Complet du Backend Expérience Tech
# Ce script démarre MongoDB et le backend avec toutes les vérifications nécessaires

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DÉMARRAGE DU BACKEND EXPÉRIENCE TECH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Configuration des chemins
PROJECT_DIR="/Users/nguemsprince/Desktop/Projet"
NODE_PATH="$PROJECT_DIR/node-v18.19.0-darwin-x64/bin"
MONGODB_PATH="$PROJECT_DIR/mongodb-macos-x86_64-7.0.5/bin"
MONGODB_DATA_DIR="$PROJECT_DIR/mongodb-data"
MONGODB_LOG_FILE="$PROJECT_DIR/mongodb.log"
BACKEND_DIR="$PROJECT_DIR/backend"

# Ajouter Node.js au PATH
export PATH="$NODE_PATH:$PATH"

echo "📁 Répertoire du projet: $PROJECT_DIR"
echo "🔧 Node.js: $(node --version 2>/dev/null || echo 'Non trouvé')"
echo "📦 MongoDB: $MONGODB_PATH/mongod"
echo ""

# Fonction pour vérifier si un port est utilisé
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port utilisé
    else
        return 1  # Port libre
    fi
}

# Fonction pour vérifier si MongoDB est en cours d'exécution
check_mongodb() {
    if check_port 27017; then
        # Vérifier si c'est vraiment MongoDB
        if pgrep -f "mongod" > /dev/null 2>&1; then
            return 0  # MongoDB est en cours d'exécution
        fi
    fi
    return 1  # MongoDB n'est pas en cours d'exécution
}

# Fonction pour démarrer MongoDB
start_mongodb() {
    echo "🗄️  Démarrage de MongoDB..."
    
    # Vérifier si MongoDB est déjà en cours d'exécution
    if check_mongodb; then
        echo "✅ MongoDB est déjà en cours d'exécution sur le port 27017"
        return 0
    fi
    
    # Vérifier si le port 27017 est utilisé par autre chose
    if check_port 27017; then
        echo "⚠️  Le port 27017 est utilisé par un autre processus"
        echo "   Tentative de libération du port..."
        lsof -ti:27017 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    # Créer le répertoire de données s'il n'existe pas
    if [ ! -d "$MONGODB_DATA_DIR" ]; then
        echo "📁 Création du répertoire de données MongoDB..."
        mkdir -p "$MONGODB_DATA_DIR"
    fi
    
    # Vérifier si le binaire MongoDB existe
    if [ ! -f "$MONGODB_PATH/mongod" ]; then
        echo "❌ Erreur: Le binaire MongoDB n'est pas trouvé à $MONGODB_PATH/mongod"
        echo "   Veuillez vérifier l'installation de MongoDB"
        return 1
    fi
    
    # Démarrer MongoDB
    echo "🚀 Démarrage de MongoDB avec les paramètres:"
    echo "   - Répertoire de données: $MONGODB_DATA_DIR"
    echo "   - Fichier de log: $MONGODB_LOG_FILE"
    echo "   - Port: 27017"
    
    # Démarrer MongoDB en arrière-plan
    "$MONGODB_PATH/mongod" \
        --dbpath "$MONGODB_DATA_DIR" \
        --port 27017 \
        --logpath "$MONGODB_LOG_FILE" \
        --fork \
        > /dev/null 2>&1
    
    # Attendre que MongoDB démarre
    echo "⏳ Attente du démarrage de MongoDB..."
    sleep 3
    
    # Vérifier si MongoDB a démarré avec succès
    if check_mongodb; then
        echo "✅ MongoDB démarré avec succès"
        echo "   - Port: 27017"
        echo "   - Log: $MONGODB_LOG_FILE"
        return 0
    else
        echo "❌ Erreur: MongoDB n'a pas démarré correctement"
        echo "   Vérifiez les logs dans $MONGODB_LOG_FILE"
        return 1
    fi
}

# Fonction pour démarrer le backend
start_backend() {
    echo ""
    echo "🔧 Démarrage du backend..."
    
    # Vérifier si le backend est déjà en cours d'exécution
    if check_port 5000; then
        echo "⚠️  Le port 5000 est déjà utilisé"
        echo "   Tentative de libération du port..."
        lsof -ti:5000 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    # Vérifier si le répertoire backend existe
    if [ ! -d "$BACKEND_DIR" ]; then
        echo "❌ Erreur: Le répertoire backend n'existe pas: $BACKEND_DIR"
        return 1
    fi
    
    # Vérifier si le fichier server.js existe
    if [ ! -f "$BACKEND_DIR/server.js" ]; then
        echo "❌ Erreur: Le fichier server.js n'existe pas dans $BACKEND_DIR"
        return 1
    fi
    
    # Vérifier si le fichier .env existe
    if [ ! -f "$BACKEND_DIR/.env" ]; then
        echo "⚠️  Attention: Le fichier .env n'existe pas dans $BACKEND_DIR"
        echo "   Le backend utilisera les valeurs par défaut"
    fi
    
    # Aller dans le répertoire backend
    cd "$BACKEND_DIR"
    
    # Démarrer le backend en arrière-plan
    echo "🚀 Démarrage du serveur backend..."
    nohup "$NODE_PATH/node" server.js > "$PROJECT_DIR/backend.log" 2>&1 &
    BACKEND_PID=$!
    
    # Retourner au répertoire racine
    cd "$PROJECT_DIR"
    
    # Attendre que le backend démarre
    echo "⏳ Attente du démarrage du backend..."
    sleep 5
    
    # Vérifier si le backend a démarré avec succès
    if check_port 5000; then
        echo "✅ Backend démarré avec succès (PID: $BACKEND_PID)"
        echo "   - Port: 5000"
        echo "   - Log: $PROJECT_DIR/backend.log"
        
        # Tester le endpoint de health check
        echo "🏥 Vérification du health check..."
        sleep 2
        if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
            echo "✅ Health check réussi - Backend opérationnel"
            return 0
        else
            echo "⚠️  Health check échoué - Le backend peut être en cours de démarrage"
            echo "   Attendez quelques secondes et réessayez"
            return 0
        fi
    else
        echo "❌ Erreur: Le backend n'a pas démarré correctement"
        echo "   Vérifiez les logs dans $PROJECT_DIR/backend.log"
        return 1
    fi
}

# Fonction pour arrêter les services
stop_services() {
    echo ""
    echo "🛑 Arrêt des services..."
    
    # Arrêter MongoDB
    if check_mongodb; then
        echo "   Arrêt de MongoDB..."
        pkill -f "mongod" 2>/dev/null || true
        sleep 2
    fi
    
    # Arrêter le backend
    if check_port 5000; then
        echo "   Arrêt du backend..."
        lsof -ti:5000 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    echo "✅ Services arrêtés"
}

# Gestion des signaux pour arrêter proprement
trap stop_services EXIT INT TERM

# Étape 1: Démarrer MongoDB
if ! start_mongodb; then
    echo ""
    echo "❌ Échec du démarrage de MongoDB"
    echo "   Veuillez vérifier les logs et réessayer"
    exit 1
fi

# Étape 2: Démarrer le backend
if ! start_backend; then
    echo ""
    echo "❌ Échec du démarrage du backend"
    echo "   Veuillez vérifier les logs et réessayer"
    exit 1
fi

# Résumé
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 BACKEND DÉMARRÉ AVEC SUCCÈS !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Services en cours d'exécution:"
echo "   🗄️  MongoDB: localhost:27017"
echo "   🔧 Backend:  http://localhost:5000"
echo "   🏥 Health:   http://localhost:5000/api/health"
echo ""
echo "📄 Logs:"
echo "   - MongoDB: $MONGODB_LOG_FILE"
echo "   - Backend: $PROJECT_DIR/backend.log"
echo ""
echo "🛑 Pour arrêter les services:"
echo "   Appuyez sur Ctrl+C ou exécutez:"
echo "   pkill -f mongod && lsof -ti:5000 | xargs kill -9"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Garder le script actif pour maintenir les services en cours d'exécution
echo "💡 Le backend est en cours d'exécution..."
echo "   Appuyez sur Ctrl+C pour arrêter tous les services"
echo ""

# Attendre indéfiniment (ou jusqu'à ce que le script soit interrompu)
wait

