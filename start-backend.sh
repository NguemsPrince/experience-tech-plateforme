#!/bin/bash

# Script pour démarrer le backend
cd "$(dirname "$0")/backend"

# Charger les variables d'environnement si .env existe
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Vérifier si MongoDB est accessible
if ! nc -z localhost 27017 2>/dev/null; then
    echo "⚠️  Attention: MongoDB ne semble pas être en cours d'exécution sur localhost:27017"
    echo "   Assurez-vous que MongoDB est démarré avant de continuer"
    echo ""
fi

# Démarrer le serveur
echo "🚀 Démarrage du serveur backend sur le port ${PORT:-5000}..."
echo ""

# Utiliser npx ou node selon ce qui est disponible
if command -v node &> /dev/null; then
    node server.js
elif [ -f "../node-v18.19.0-darwin-x64/bin/node" ]; then
    ../node-v18.19.0-darwin-x64/bin/node server.js
else
    echo "❌ Erreur: Node.js n'est pas trouvé"
    echo "   Veuillez installer Node.js ou le mettre dans votre PATH"
    exit 1
fi
