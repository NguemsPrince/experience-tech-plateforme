# 🚀 Guide de Configuration Complète - Plateforme Expérience Tech

## 📋 Table des Matières
1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Démarrage](#démarrage)
5. [Vérification](#vérification)
6. [Résolution des Problèmes](#résolution-des-problèmes)

## 🔧 Prérequis

### Logiciels Requis
- **Node.js** >= 18.x (disponible dans le projet : `node-v18.19.0-darwin-x64`)
- **MongoDB** (local ou distant)
- **npm** ou **yarn**
- **Git** (optionnel)

### Vérification des Prérequis
```bash
# Vérifier la version de Node.js
node --version  # Doit être >= 18.x

# Vérifier la version de npm
npm --version

# Vérifier que MongoDB est installé et accessible
mongod --version
```

## 📦 Installation

### 1. Cloner le Projet (si nécessaire)
```bash
git clone <repository-url>
cd Projet
```

### 2. Initialiser les Fichiers .env
```bash
# Méthode automatique (recommandée)
./init-env.sh

# Ou manuellement
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
```

### 3. Installer les Dépendances
```bash
# Installer toutes les dépendances (racine, frontend, backend)
npm run install-all

# Ou manuellement
npm install
cd frontend && npm install --legacy-peer-deps
cd ../backend && npm install
```

## ⚙️ Configuration

### Backend Configuration (`backend/.env`)

#### Configuration de Base
```env
NODE_ENV=development
PORT=5000
```

#### Configuration MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/experience_tech
MONGODB_TEST_URI=mongodb://localhost:27017/experience_tech_test
```

#### Configuration JWT
```env
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_this_in_production
JWT_REFRESH_EXPIRE=30d
```

**⚠️ Important**: Changez les clés JWT_SECRET et JWT_REFRESH_SECRET en production !

#### Configuration CORS
```env
CORS_ORIGIN=http://localhost:3000
```

#### Configuration Stripe (Optionnel)
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

### Frontend Configuration (`frontend/.env`)

#### Configuration de Base
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Expérience Tech
REACT_APP_VERSION=1.0.0
```

#### Configuration Stripe (Optionnel)
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

#### Configuration Google Analytics (Optionnel)
```env
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🚀 Démarrage

### Mode Développement (Recommandé)
```bash
# Démarrer le serveur backend et frontend simultanément
npm run dev

# Le backend sera accessible sur http://localhost:5000
# Le frontend sera accessible sur http://localhost:3000
```

### Mode Développement (Séparé)
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Mode Production
```bash
# Build du frontend
npm run build

# Démarrer le serveur backend
npm start
```

## ✅ Vérification

### 1. Vérifier que MongoDB est Accessible
```bash
# Vérifier que MongoDB est en cours d'exécution
mongod --version

# Ou vérifier la connexion
mongo --eval "db.version()"
```

### 2. Vérifier que le Backend Démarre Correctement
```bash
# Vérifier l'endpoint de santé
curl http://localhost:5000/api/health

# Réponse attendue:
# {
#   "status": "success",
#   "message": "Expérience Tech API is running",
#   "timestamp": "...",
#   "environment": "development"
# }
```

### 3. Vérifier que le Frontend Compile Sans Erreurs
```bash
# Le frontend devrait se compiler automatiquement lors du démarrage
# Vérifier qu'il n'y a pas d'erreurs dans la console
```

### 4. Tester l'Authentification
```bash
# Tester l'inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "Test123"
  }'

# Tester la connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }'
```

## 🔧 Résolution des Problèmes

### Problème: Port 5000 déjà utilisé
```bash
# Solution 1: Modifier le port dans backend/.env
PORT=5001

# Solution 2: Arrêter le processus utilisant le port 5000
# Sur macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Sur Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Problème: MongoDB non accessible
```bash
# Solution 1: Démarrer MongoDB localement
mongod

# Solution 2: Utiliser MongoDB Atlas (cloud)
# Modifier MONGODB_URI dans backend/.env avec votre URI MongoDB Atlas
```

### Problème: Erreurs de dépendances
```bash
# Solution 1: Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Solution 2: Utiliser --legacy-peer-deps
npm install --legacy-peer-deps
```

### Problème: Erreurs de compilation React
```bash
# Solution 1: Nettoyer le cache
cd frontend
rm -rf node_modules .cache build
npm install

# Solution 2: Vérifier les variables d'environnement
# Assurez-vous que REACT_APP_API_URL est défini dans frontend/.env
```

### Problème: Erreurs JWT
```bash
# Solution 1: Vérifier que JWT_SECRET est défini dans backend/.env
# Solution 2: Vérifier que JWT_REFRESH_SECRET est défini dans backend/.env
# Solution 3: Générer de nouvelles clés JWT
```

## 📚 Commandes Utiles

### Scripts NPM Disponibles
```bash
# Développement
npm run dev              # Démarrer backend + frontend
npm run server           # Démarrer uniquement le backend
npm run client           # Démarrer uniquement le frontend

# Installation
npm run install-all      # Installer toutes les dépendances
npm run init-env         # Initialiser les fichiers .env

# Build
npm run build            # Build du frontend
npm start                # Démarrer le backend en production

# Tests
npm test                 # Tests frontend
npm run test:backend     # Tests backend

# Linting
npm run lint             # Linter frontend
npm run lint:fix         # Corriger les erreurs de linting
```

## 🔐 Sécurité

### Recommandations de Sécurité
1. **Ne commitez jamais les fichiers .env** (ils sont dans .gitignore)
2. **Changez les clés JWT_SECRET en production**
3. **Utilisez des mots de passe forts pour MongoDB**
4. **Activez HTTPS en production**
5. **Configurez CORS correctement**
6. **Utilisez des variables d'environnement pour les secrets**

## 📞 Support

Pour toute question ou problème :
1. Consultez le fichier `CORRECTIONS_APPLIQUEES.md`
2. Vérifiez les logs dans la console
3. Consultez la documentation des technologies utilisées
4. Contactez l'équipe de développement

## 🎯 Prochaines Étapes

1. ✅ Configuration des fichiers .env
2. ✅ Installation des dépendances
3. ✅ Démarrage du serveur de développement
4. ⏭️ Configuration MongoDB
5. ⏭️ Configuration des clés API (Stripe, Google Maps, etc.)
6. ⏭️ Tests des fonctionnalités principales
7. ⏭️ Déploiement en production

---

**Date de dernière mise à jour**: 11 Novembre 2025
**Version**: 1.0.0

