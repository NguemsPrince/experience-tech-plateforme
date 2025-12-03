#!/bin/bash

echo "🧪 Test du Forum Expérience Tech"
echo "================================"

# Test de l'API Backend
echo "📡 Test de l'API Backend..."
echo "----------------------------"

# Test des catégories
echo "1. Test des catégories..."
CATEGORIES_RESPONSE=$(curl -s http://localhost:5000/api/forum/categories)
if echo "$CATEGORIES_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Catégories: OK"
    CATEGORIES_COUNT=$(echo "$CATEGORIES_RESPONSE" | grep -o '"_id"' | wc -l)
    echo "   📊 Nombre de catégories: $CATEGORIES_COUNT"
else
    echo "❌ Catégories: ERREUR"
fi

# Test des posts
echo "2. Test des posts..."
POSTS_RESPONSE=$(curl -s http://localhost:5000/api/forum/posts)
if echo "$POSTS_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Posts: OK"
else
    echo "❌ Posts: ERREUR"
fi

# Test du frontend
echo ""
echo "🌐 Test du Frontend..."
echo "----------------------"

# Vérifier si le frontend répond
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✅ Frontend React: OK (Port 3000)"
else
    echo "❌ Frontend React: ERREUR (Code: $FRONTEND_RESPONSE)"
fi

# Test de MongoDB
echo ""
echo "🗄️  Test de MongoDB..."
echo "----------------------"

# Vérifier si MongoDB est en cours d'exécution
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB: OK"
else
    echo "❌ MongoDB: ERREUR (Pas en cours d'exécution)"
fi

echo ""
echo "🎯 Résumé des tests"
echo "=================="
echo "Backend API: http://localhost:5000/api/forum"
echo "Frontend: http://localhost:3000"
echo "Forum: http://localhost:3000/forum"
echo "Admin Forum: http://localhost:3000/forum/admin"
echo ""
echo "📚 Documentation: FORUM_DOCUMENTATION.md"
echo "🚀 Script d'initialisation: ./init-forum.sh"
echo ""
echo "✨ Le forum Expérience Tech est prêt à être utilisé !"
