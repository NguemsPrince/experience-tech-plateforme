# 📦 Guide d'installation et de démarrage - Expérience Tech

## 🚀 Installation rapide (5 minutes)

### Prérequis

Assurez-vous d'avoir installé :
- ✅ **Node.js** (v18 ou supérieur) - [Télécharger](https://nodejs.org/)
- ✅ **MongoDB** (v7 ou supérieur) - Déjà installé dans le projet
- ✅ **Git** - [Télécharger](https://git-scm.com/)
- ✅ **Terminal/Invite de commandes**

### Étape 1: Cloner et installer les dépendances

```bash
# Se placer dans le dossier du projet
cd /Users/nguemsprince/Desktop/Projet

# Installer toutes les dépendances (frontend et backend)
npm run install-all
```

### Étape 2: Configuration des variables d'environnement

#### Backend (.env)
```bash
# Créer le fichier .env dans le dossier backend
cd backend
cat > .env << EOF
# Base de données
MONGODB_URI=mongodb://localhost:27017/experience_tech
NODE_ENV=development

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=votre_refresh_secret_super_securise
JWT_REFRESH_EXPIRE=30d

# Serveur
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (optionnel - pour reset password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre@email.com
EMAIL_PASSWORD=votre_mot_de_passe_app

# Stripe (optionnel - pour les paiements)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EOF
```

#### Frontend (.env)
```bash
# Créer le fichier .env dans le dossier frontend
cd ../frontend
cat > .env << EOF
# API
REACT_APP_API_URL=http://localhost:5000/api

# Mode
REACT_APP_ENV=development

# Google Maps (optionnel)
REACT_APP_GOOGLE_MAPS_API_KEY=votre_cle_api

# Stripe (optionnel)
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
EOF
```

### Étape 3: Démarrer MongoDB

```bash
# Depuis la racine du projet
cd /Users/nguemsprince/Desktop/Projet

# Démarrer MongoDB
./mongodb-macos-x86_64-7.0.5/bin/mongod --dbpath ./mongodb-data --logpath ./mongodb.log --fork

# Vérifier que MongoDB fonctionne
./mongodb-macos-x86_64-7.0.5/bin/mongosh
# Tapez "exit" pour quitter mongosh
```

### Étape 4: Créer un utilisateur admin

```bash
# Depuis le dossier backend
cd backend
node create-admin-quick.js
```

**Résultat attendu:**
```
✅ Admin créé avec succès !
Email: admin@experiencetech.td
Mot de passe: Admin123
```

### Étape 5: Lancer l'application

#### Option A: Lancer tout en une commande (recommandé)
```bash
# Depuis la racine du projet
npm run dev
```

#### Option B: Lancer séparément (pour le debug)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Étape 6: Accéder à l'application

🌐 **Frontend**: [http://localhost:3000](http://localhost:3000)  
🔧 **Backend API**: [http://localhost:5000](http://localhost:5000)  
📊 **MongoDB**: [mongodb://localhost:27017](mongodb://localhost:27017)

---

## 👤 Comptes de test

### Administrateur
- **Email**: `admin@experiencetech.td`
- **Mot de passe**: `Admin123`
- **Accès**: Dashboard admin, gestion des utilisateurs, contenus, etc.

### Utilisateur de test (optionnel)
```bash
cd backend
node create-demo-user.js
```

---

## 🛠️ Commandes utiles

### Développement

```bash
# Démarrer en mode développement (tout)
npm run dev

# Démarrer seulement le backend
npm run server

# Démarrer seulement le frontend
npm run client

# Build production du frontend
npm run build
```

### MongoDB

```bash
# Démarrer MongoDB
./mongodb-macos-x86_64-7.0.5/bin/mongod --dbpath ./mongodb-data --logpath ./mongodb.log --fork

# Se connecter à MongoDB
./mongodb-macos-x86_64-7.0.5/bin/mongosh

# Arrêter MongoDB
./mongodb-macos-x86_64-7.0.5/bin/mongosh --eval "db.adminCommand({shutdown:1})"
```

### Base de données

```bash
# Seed des formations
cd backend
npm run seed:courses

# Initialiser les catégories du forum
npm run init:forum

# Lister tous les utilisateurs
node list-users.js
```

### Tests

```bash
# Tests frontend
cd frontend
npm test

# Tests coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

---

## 📂 Structure du projet

```
Projet/
├── backend/                    # API Node.js/Express
│   ├── config/                # Configuration DB
│   ├── controllers/           # Logique métier
│   ├── middleware/            # Middlewares (auth, errors)
│   ├── models/               # Modèles MongoDB
│   ├── routes/               # Routes API
│   ├── services/             # Services externes
│   ├── utils/                # Utilitaires
│   ├── .env                  # Variables d'environnement
│   ├── server.js             # Point d'entrée
│   └── package.json
│
├── frontend/                  # Application React
│   ├── public/               # Fichiers statiques
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   │   ├── forms/       # ✨ Composants de formulaire
│   │   │   ├── AdvancedSearch.js  # ✨ Recherche avancée
│   │   │   └── CartEnhanced.js    # ✨ Panier amélioré
│   │   ├── hooks/           # Hooks personnalisés
│   │   │   └── useCartEnhanced.js # ✨ Hook panier
│   │   ├── pages/           # Pages de l'app
│   │   │   ├── LoginEnhanced.js   # ✨ Login amélioré
│   │   │   └── RegisterEnhanced.js # ✨ Register amélioré
│   │   ├── services/        # Services API
│   │   │   └── apiEnhanced.js     # ✨ API améliorée
│   │   ├── utils/           # Utilitaires
│   │   │   └── validationSchemas.js # ✨ Schémas Zod
│   │   ├── locales/         # Traductions (FR, EN, AR)
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                  # Variables d'environnement
│   ├── package.json
│   └── tailwind.config.js
│
├── mongodb-macos-x86_64-7.0.5/  # MongoDB binaires
├── mongodb-data/                # Données MongoDB
├── node_modules/                # Dépendances racine
├── package.json                 # Scripts racine
├── README.md                    # Documentation principale
├── AMELIORATIONS_PROFESSIONNELLES_2025.md  # ✨ Ce guide
└── GUIDE_INSTALLATION_COMPLETE.md          # ✨ Guide installation
```

---

## 🔧 Résolution des problèmes

### MongoDB ne démarre pas

```bash
# Vérifier si MongoDB est déjà lancé
ps aux | grep mongod

# Tuer le processus si nécessaire
pkill mongod

# Nettoyer les fichiers de lock
rm -f mongodb-data/mongod.lock

# Redémarrer
./mongodb-macos-x86_64-7.0.5/bin/mongod --dbpath ./mongodb-data --logpath ./mongodb.log --fork
```

### Port déjà utilisé

```bash
# Trouver le processus sur le port 3000
lsof -ti:3000

# Tuer le processus
kill -9 $(lsof -ti:3000)

# Même chose pour le port 5000
kill -9 $(lsof -ti:5000)
```

### Erreurs npm install

```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Si conflits de dépendances
npm install --legacy-peer-deps
```

### Erreur CORS

Vérifiez que dans `backend/.env` :
```
CORS_ORIGIN=http://localhost:3000
```

Et que le frontend utilise bien l'URL du backend :
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Erreur JWT

Vérifiez que dans `backend/.env` :
```
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
JWT_REFRESH_SECRET=votre_refresh_secret_super_securise
```

### React ne compile pas

```bash
cd frontend

# Nettoyer le cache
rm -rf node_modules/.cache

# Réinstaller
npm install

# Redémarrer
npm start
```

---

## 🧪 Vérification de l'installation

### 1. Backend (API)

```bash
# Test de santé
curl http://localhost:5000/api/health

# Résultat attendu:
{
  "status": "success",
  "message": "Expérience Tech API is running",
  "timestamp": "2025-10-28T...",
  "environment": "development"
}
```

### 2. Frontend

Ouvrez [http://localhost:3000](http://localhost:3000) et vérifiez :
- ✅ La page d'accueil se charge
- ✅ Le header s'affiche
- ✅ Les images se chargent
- ✅ Vous pouvez naviguer entre les pages

### 3. Authentification

1. Allez sur [http://localhost:3000/login](http://localhost:3000/login)
2. Connectez-vous avec :
   - Email: `admin@experiencetech.td`
   - Mot de passe: `Admin123`
3. Vous devriez être redirigé vers le dashboard admin

### 4. Base de données

```bash
# Se connecter à MongoDB
./mongodb-macos-x86_64-7.0.5/bin/mongosh

# Vérifier la base de données
use experience_tech
show collections
db.users.count()

# Devrait montrer au moins 1 utilisateur (admin)
```

---

## 📚 Ressources supplémentaires

### Documentation
- 📖 [README.md](README.md) - Vue d'ensemble du projet
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture technique
- ✨ [AMELIORATIONS_PROFESSIONNELLES_2025.md](AMELIORATIONS_PROFESSIONNELLES_2025.md) - Améliorations détaillées

### Technologies utilisées
- **React**: [Documentation officielle](https://react.dev/)
- **Node.js**: [Documentation officielle](https://nodejs.org/docs)
- **MongoDB**: [Documentation officielle](https://docs.mongodb.com/)
- **Tailwind CSS**: [Documentation officielle](https://tailwindcss.com/docs)
- **Express**: [Documentation officielle](https://expressjs.com/)

### Tutoriels et guides
- **React Hook Form**: [Documentation](https://react-hook-form.com/)
- **Zod**: [Documentation](https://zod.dev/)
- **Framer Motion**: [Documentation](https://www.framer.com/motion/)

---

## 🚀 Déploiement en production

### Préparer le build

```bash
# Build du frontend
cd frontend
npm run build

# Le dossier build/ contient l'application prête pour la production
```

### Variables d'environnement production

#### Backend
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/experience_tech
JWT_SECRET=secret_production_tres_securise
CORS_ORIGIN=https://votre-domaine.com
PORT=5000
```

#### Frontend
```bash
REACT_APP_API_URL=https://api.votre-domaine.com/api
REACT_APP_ENV=production
```

### Options de déploiement

#### Option 1: Vercel (Frontend) + Heroku (Backend)
- **Frontend**: Déployez sur [Vercel](https://vercel.com)
- **Backend**: Déployez sur [Heroku](https://heroku.com)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### Option 2: DigitalOcean / AWS
- Serveur VPS avec Node.js
- Nginx comme reverse proxy
- PM2 pour gérer les processus
- MongoDB sur le même serveur ou Atlas

#### Option 3: Docker
```bash
# Créer des images Docker
docker-compose up -d
```

---

## 📞 Support

### Besoin d'aide ?

1. **Documentation interne**
   - Lisez d'abord README.md et ARCHITECTURE.md
   - Consultez les commentaires dans le code

2. **Problèmes techniques**
   - Vérifiez les logs: `mongodb.log` et `backend.log`
   - Consultez la console du navigateur (F12)

3. **Contact**
   - Email: support@experiencetech.td
   - GitHub Issues (si applicable)

---

## ✨ Prochaines étapes

Maintenant que l'installation est complète :

1. ✅ **Explorez l'application**
   - Naviguez entre les pages
   - Testez les fonctionnalités
   - Créez du contenu de test

2. ✅ **Personnalisez**
   - Modifiez les couleurs dans `tailwind.config.js`
   - Ajoutez vos images dans `public/images/`
   - Personnalisez les textes dans `locales/`

3. ✅ **Développez**
   - Ajoutez de nouvelles fonctionnalités
   - Créez de nouveaux composants
   - Étendez l'API

4. ✅ **Déployez**
   - Préparez le build de production
   - Configurez votre serveur
   - Lancez votre plateforme !

---

**🎉 Félicitations ! Votre plateforme Expérience Tech est prête !**

Développé avec ❤️ | Octobre 2025 | Version 2.0.0

