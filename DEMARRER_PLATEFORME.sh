#!/bin/bash

# 🚀 Script de Démarrage Automatique de la Plateforme Expérience Tech
# Usage: ./DEMARRER_PLATEFORME.sh

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DÉMARRAGE DE LA PLATEFORME EXPÉRIENCE TECH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Aller dans le dossier racine
cd /Users/nguemsprince/Desktop/Projet

# Définir le PATH pour Node.js local
export PATH="/Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin:$PATH"

# Arrêter les processus existants
echo "🛑 Arrêt des processus existants..."
lsof -ti:3000 -ti:5000 | xargs kill -9 2>/dev/null
sleep 2
echo "✅ Ports libérés"
echo ""

# Démarrer MongoDB si nécessaire
echo "🗄️  Vérification de MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB n'est pas en cours d'exécution"
    echo "   Démarrage de MongoDB..."
    mongod --config /opt/homebrew/etc/mongod.conf > /dev/null 2>&1 &
    sleep 3
fi
echo "✅ MongoDB opérationnel"
echo ""

# Démarrer le backend
echo "🔧 Démarrage du backend..."
cd backend
bash ../start-backend.sh > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 5
echo "✅ Backend démarré (PID: $BACKEND_PID)"
echo ""

# Vérifier le backend
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend opérationnel sur http://localhost:5000"
else
    echo "⚠️  Backend en cours de démarrage..."
fi
echo ""

# Démarrer le frontend
echo "🌐 Démarrage du frontend..."
bash start-react.sh > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 20
echo "✅ Frontend démarré (PID: $FRONTEND_PID)"
echo ""

# Vérifier le frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend opérationnel sur http://localhost:3000"
else
    echo "⚠️  Frontend en cours de compilation..."
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 PLATEFORME DÉMARRÉE AVEC SUCCÈS !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 URLs disponibles :"
echo "   🌐 Frontend : http://localhost:3000"
echo "   🔧 Backend  : http://localhost:5000"
echo "   📊 Health   : http://localhost:5000/api/health"
echo ""
echo "📦 Fonctionnalités disponibles :"
echo "   ✅ Navigation améliorée"
echo "   ✅ Paiement par carte prépayée"
echo "   ✅ Mes Formations"
echo "   ✅ Mon Panier"
echo "   ✅ Cartes de test : EXPP79GI1KRCRYJ, EXPCHVCQBCID2XD"
echo ""
echo "📋 Pour arrêter les services :"
echo "   lsof -ti:3000 -ti:5000 | xargs kill -9"
echo ""
echo "📄 Documentation :"
echo "   → Lire DEMARRAGE_RAPIDE_AMELIORATIONS.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

