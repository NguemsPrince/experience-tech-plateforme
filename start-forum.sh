#!/bin/bash

echo "🚀 Démarrage du Forum Expérience Tech"
echo "======================================"

# Arrêter tous les processus existants
echo "🛑 Arrêt des processus existants..."
pkill -f "react-scripts" 2>/dev/null
pkill -f "node server.js" 2>/dev/null
sleep 3

# Vérifier que MongoDB est en cours d'exécution
echo "🗄️  Vérification de MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB n'est pas en cours d'exécution"
    echo "   Veuillez démarrer MongoDB d'abord :"
    echo "   Sur macOS: brew services start mongodb-community"
    echo "   Sur Ubuntu: sudo systemctl start mongod"
    exit 1
fi
echo "✅ MongoDB est en cours d'exécution"

# Démarrer le backend
echo "🔧 Démarrage du backend..."
cd backend
nohup node server.js > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Attendre que le backend démarre
echo "⏳ Attente du démarrage du backend..."
sleep 5

# Tester le backend
if curl -s http://localhost:5000/api/forum/categories > /dev/null; then
    echo "✅ Backend démarré avec succès (PID: $BACKEND_PID)"
else
    echo "❌ Erreur lors du démarrage du backend"
    echo "   Vérifiez les logs dans backend.log"
    exit 1
fi

# Démarrer le frontend
echo "🌐 Démarrage du frontend..."
cd frontend
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Attendre que le frontend démarre
echo "⏳ Attente du démarrage du frontend..."
sleep 15

# Tester le frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ Frontend démarré avec succès (PID: $FRONTEND_PID)"
else
    echo "⚠️  Frontend en cours de démarrage..."
    echo "   Il peut prendre quelques minutes supplémentaires"
fi

echo ""
echo "🎉 Services démarrés !"
echo "======================"
echo "Backend: http://localhost:5000 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo "Forum: http://localhost:3000/forum"
echo "Admin: http://localhost:3000/forum/admin"
echo ""
echo "📋 Logs:"
echo "  Backend: tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "🛑 Pour arrêter:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "✨ Le forum Expérience Tech est maintenant accessible !"
