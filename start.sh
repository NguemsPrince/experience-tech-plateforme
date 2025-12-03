#!/bin/bash

# Script de démarrage pour Expérience Tech Platform
# Ce script configure le PATH pour utiliser Node.js du projet et démarre les serveurs

cd "$(dirname "$0")"

# Ajouter Node.js du projet au PATH
export PATH="$(pwd)/node-v18.19.0-darwin-x64/bin:$PATH"

# Vérifier que Node.js est disponible
if [ ! -f "./node-v18.19.0-darwin-x64/bin/node" ]; then
    echo "❌ Erreur: Node.js n'est pas trouvé."
    echo "Vérifiez que le dossier node-v18.19.0-darwin-x64 existe dans le projet."
    exit 1
fi

echo "✅ Node.js version: $(./node-v18.19.0-darwin-x64/bin/node --version)"
echo "✅ npm version: $(./node-v18.19.0-darwin-x64/bin/npm --version)"
echo ""
echo "🚀 Démarrage des serveurs..."
echo ""

# Démarrer les serveurs avec le PATH configuré
PATH="$(pwd)/node-v18.19.0-darwin-x64/bin:$PATH" npm run dev

