# 🚀 Guide de Déploiement sur Render - Plateforme Expérience Tech

Ce guide vous explique comment déployer votre plateforme web dynamique Expérience Tech sur Render.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Préparation du Projet](#préparation-du-projet)
3. [Configuration MongoDB](#configuration-mongodb)
4. [Déploiement du Backend](#déploiement-du-backend)
5. [Déploiement du Frontend](#déploiement-du-frontend)
6. [Configuration des Variables d'Environnement](#configuration-des-variables-denvironnement)
7. [Configuration CORS](#configuration-cors)
8. [Vérification du Déploiement](#vérification-du-déploiement)
9. [Dépannage](#dépannage)

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte [Render](https://render.com) (gratuit ou payant)
- ✅ Un compte [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuit disponible)
- ✅ Votre code sur GitHub, GitLab ou Bitbucket
- ✅ Les clés API nécessaires (Stripe, Sentry, Cloudinary, etc.)

---

## 📦 Préparation du Projet

### 1. Vérifier la Structure du Projet

Votre projet doit avoir cette structure :
```
Projet/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env (ne pas commiter)
├── frontend/
│   ├── package.json
│   └── .env (ne pas commiter)
└── render.yaml (optionnel)
```

### 2. S'assurer que le Code est sur Git

```bash
# Vérifier le statut Git
git status

# Si nécessaire, initialiser Git
git init
git add .
git commit -m "Initial commit - Ready for Render deployment"
git remote add origin <votre-repo-url>
git push -u origin main
```

---

## 🗄️ Configuration MongoDB

### Option 1 : MongoDB Atlas (Recommandé)

1. **Créer un compte MongoDB Atlas**
   - Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Créez un compte gratuit (M0 - Free Tier)

2. **Créer un Cluster**
   - Cliquez sur "Build a Database"
   - Choisissez le plan gratuit (M0)
   - Sélectionnez une région proche de vos utilisateurs
   - Créez le cluster (cela peut prendre quelques minutes)

3. **Configurer l'Accès Réseau**
   - Allez dans "Network Access"
   - Cliquez sur "Add IP Address"
   - Pour le développement : Ajoutez `0.0.0.0/0` (tous les IPs)
   - Pour la production : Ajoutez uniquement les IPs de Render

4. **Créer un Utilisateur de Base de Données**
   - Allez dans "Database Access"
   - Cliquez sur "Add New Database User"
   - Créez un utilisateur avec un mot de passe fort
   - Notez le nom d'utilisateur et le mot de passe

5. **Récupérer la Chaîne de Connexion**
   - Allez dans "Database" > "Connect"
   - Choisissez "Connect your application"
   - Copiez la chaîne de connexion
   - Remplacez `<password>` par votre mot de passe
   - Exemple : `mongodb+srv://username:password@cluster.mongodb.net/experience_tech?retryWrites=true&w=majority`

### Option 2 : Base de Données Render (Optionnel)

Si vous préférez utiliser la base de données MongoDB de Render :

1. Dans votre dashboard Render, créez une nouvelle "MongoDB" database
2. Render vous fournira automatiquement une chaîne de connexion
3. Utilisez cette chaîne dans vos variables d'environnement

---

## 🔙 Déploiement du Backend

### Méthode 1 : Déploiement Manuel (Recommandé pour débuter)

1. **Créer un Nouveau Service Web**
   - Connectez-vous à [Render Dashboard](https://dashboard.render.com)
   - Cliquez sur "New +" > "Web Service"
   - Connectez votre repository (GitHub/GitLab/Bitbucket)

2. **Configurer le Service**
   - **Name** : `experience-tech-backend`
   - **Environment** : `Node`
   - **Region** : Choisissez la région la plus proche de vos utilisateurs
   - **Branch** : `main` (ou votre branche principale)
   - **Root Directory** : `backend`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`

3. **Plan de Service**
   - Pour commencer : Choisissez "Free" (limité mais gratuit)
   - Pour la production : Choisissez "Starter" ou supérieur

### Méthode 2 : Déploiement avec Blueprint (render.yaml)

Si vous avez créé le fichier `render.yaml` :

1. Dans Render Dashboard, cliquez sur "New +" > "Blueprint"
2. Connectez votre repository
3. Render détectera automatiquement le fichier `render.yaml`
4. Suivez les instructions pour créer les services

---

## 🎨 Déploiement du Frontend

### Méthode 1 : Déploiement comme Service Web

1. **Créer un Nouveau Service Web**
   - Dans Render Dashboard, cliquez sur "New +" > "Web Service"
   - Connectez votre repository

2. **Configurer le Service**
   - **Name** : `experience-tech-frontend`
   - **Environment** : `Node`
   - **Region** : Même région que le backend
   - **Branch** : `main`
   - **Root Directory** : `frontend`
   - **Build Command** : `npm install --legacy-peer-deps && npm run build`
   - **Start Command** : `npx serve -s build -l $PORT`

3. **Installer serve (si nécessaire)**
   - Ajoutez `serve` aux dépendances du frontend :
   ```bash
   cd frontend
   npm install serve --save
   ```

### Méthode 2 : Déploiement comme Site Statique (Recommandé)

1. **Créer un Nouveau Static Site**
   - Dans Render Dashboard, cliquez sur "New +" > "Static Site"
   - Connectez votre repository

2. **Configurer le Site**
   - **Name** : `experience-tech-frontend`
   - **Branch** : `main`
   - **Root Directory** : `frontend`
   - **Build Command** : `npm install --legacy-peer-deps && npm run build`
   - **Publish Directory** : `build`

---

## ⚙️ Configuration des Variables d'Environnement

### Variables Backend (dans Render Dashboard)

Allez dans votre service backend > "Environment" et ajoutez :

#### Variables Obligatoires

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/experience_tech?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi_en_production
JWT_REFRESH_SECRET=votre_refresh_secret_super_securise_changez_moi
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=https://votre-frontend.onrender.com,https://www.votre-domaine.com
```

#### Variables Optionnelles (selon vos besoins)

```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre@email.com
EMAIL_PASS=votre_mot_de_passe_app

# Stripe
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete_stripe
STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# Redis (si utilisé)
REDIS_URL=redis://votre-redis-url:6379

# Sentry (Monitoring)
SENTRY_DSN=https://votre-dsn@sentry.io/project-id

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Freshdesk (Support)
FRESHDESK_DOMAIN=votre-domaine.freshdesk.com
FRESHDESK_API_KEY=votre_api_key
```

### Variables Frontend (dans Render Dashboard)

Allez dans votre service frontend > "Environment" et ajoutez :

#### Variables Obligatoires

```env
REACT_APP_API_URL=https://votre-backend.onrender.com/api
REACT_APP_APP_NAME=Expérience Tech
REACT_APP_VERSION=1.0.0
```

#### Variables Optionnelles

```env
# Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique_stripe

# Google Analytics
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry
REACT_APP_SENTRY_DSN=https://votre-dsn@sentry.io/project-id

# Features
REACT_APP_AI_CHATBOT_ENABLED=true
REACT_APP_ANALYTICS_ENABLED=true
REACT_APP_MONITORING_ENABLED=true
REACT_APP_CRM_ENABLED=true
```

**⚠️ Important** : 
- Toutes les variables React doivent commencer par `REACT_APP_`
- Après avoir ajouté/modifié des variables, redéployez le service

---

## 🌐 Configuration CORS

Une fois que vous avez les URLs de vos services déployés :

1. **URL Backend** : `https://experience-tech-backend.onrender.com`
2. **URL Frontend** : `https://experience-tech-frontend.onrender.com`

Mettez à jour la variable `CORS_ORIGIN` dans le backend :

```env
CORS_ORIGIN=https://experience-tech-frontend.onrender.com,https://www.votre-domaine.com
```

Vous pouvez ajouter plusieurs origines séparées par des virgules.

---

## ✅ Vérification du Déploiement

### 1. Vérifier le Backend

1. Ouvrez l'URL de votre backend : `https://experience-tech-backend.onrender.com`
2. Vous devriez voir un JSON avec les informations de l'API
3. Testez l'endpoint de santé : `https://experience-tech-backend.onrender.com/api/health`
4. Vérifiez les logs dans Render Dashboard > "Logs"

### 2. Vérifier le Frontend

1. Ouvrez l'URL de votre frontend : `https://experience-tech-frontend.onrender.com`
2. Vérifiez que la page se charge correctement
3. Testez la connexion à l'API backend
4. Vérifiez la console du navigateur pour les erreurs

### 3. Tester les Fonctionnalités

- ✅ Connexion/Inscription
- ✅ Navigation
- ✅ Appels API
- ✅ Paiements (en mode test)
- ✅ Upload de fichiers

---

## 🔍 Dépannage

### Problème : Le backend ne démarre pas

**Solutions** :
1. Vérifiez les logs dans Render Dashboard
2. Vérifiez que `MONGODB_URI` est correctement configuré
3. Vérifiez que `PORT` est défini (Render utilise `$PORT` automatiquement)
4. Assurez-vous que `npm start` fonctionne localement

### Problème : Erreur CORS

**Solutions** :
1. Vérifiez que `CORS_ORIGIN` contient l'URL exacte du frontend
2. Vérifiez que l'URL ne se termine pas par un `/`
3. Redéployez le backend après modification de `CORS_ORIGIN`

### Problème : Le frontend ne se connecte pas au backend

**Solutions** :
1. Vérifiez que `REACT_APP_API_URL` est correctement défini
2. Vérifiez que l'URL du backend est accessible
3. Vérifiez la console du navigateur pour les erreurs
4. Assurez-vous que le backend est déployé et fonctionne

### Problème : Erreur de build

**Solutions** :
1. Vérifiez les logs de build dans Render
2. Testez le build localement : `cd frontend && npm run build`
3. Vérifiez que toutes les dépendances sont dans `package.json`
4. Pour le frontend, utilisez `--legacy-peer-deps` si nécessaire

### Problème : Variables d'environnement non prises en compte

**Solutions** :
1. Redéployez le service après avoir ajouté/modifié des variables
2. Vérifiez que les noms des variables sont corrects
3. Pour React, assurez-vous que les variables commencent par `REACT_APP_`

### Problème : Service gratuit qui s'endort

**Solutions** :
- Les services gratuits sur Render s'endorment après 15 minutes d'inactivité
- Le premier démarrage après l'endormissement peut prendre 30-60 secondes
- Pour éviter cela, passez à un plan payant ou utilisez un service de "ping" pour maintenir le service actif

---

## 📊 Monitoring et Logs

### Consulter les Logs

1. Dans Render Dashboard, allez dans votre service
2. Cliquez sur l'onglet "Logs"
3. Les logs sont en temps réel

### Monitoring

- **Uptime** : Render fournit des statistiques d'uptime
- **Sentry** : Configurez Sentry pour le suivi des erreurs
- **Google Analytics** : Suivez l'utilisation de votre application

---

## 🔄 Déploiement Continu (CI/CD)

Render déploie automatiquement à chaque push sur la branche principale :

1. **Push sur main** → Déploiement automatique
2. **Pull Request** → Prévisualisation automatique (si configuré)

Pour désactiver le déploiement automatique :
- Allez dans Settings > "Auto-Deploy" > Désactivez

---

## 🔐 Sécurité

### Bonnes Pratiques

1. **Ne commitez jamais les fichiers `.env`**
2. **Utilisez des secrets forts pour JWT**
3. **Limitez les origines CORS**
4. **Activez HTTPS** (automatique sur Render)
5. **Utilisez des variables d'environnement pour tous les secrets**
6. **Activez l'authentification à 2 facteurs sur Render**

### Rotation des Secrets

- Changez régulièrement les clés JWT
- Mettez à jour les mots de passe MongoDB
- Révisez les clés API régulièrement

---

## 📈 Optimisation des Performances

### Backend

- Utilisez Redis pour le cache
- Optimisez les requêtes MongoDB
- Activez la compression (déjà configuré dans votre code)

### Frontend

- Les assets sont automatiquement optimisés par React
- Utilisez le lazy loading (déjà configuré)
- Optimisez les images avec Cloudinary

---

## 💰 Coûts

### Plan Gratuit

- **Backend** : S'endort après 15 min d'inactivité
- **Frontend** : Déploiement statique gratuit illimité
- **Base de données** : Non incluse (utilisez MongoDB Atlas gratuit)

### Plan Starter (Recommandé pour Production)

- **Backend** : $7/mois - Toujours actif
- **Frontend** : Gratuit (statique)
- **Base de données** : $7/mois (si vous utilisez celle de Render)

---

## 📞 Support

- **Documentation Render** : [https://render.com/docs](https://render.com/docs)
- **Support Render** : support@render.com
- **Status Page** : [https://status.render.com](https://status.render.com)

---

## ✅ Checklist de Déploiement

- [ ] Code sur Git (GitHub/GitLab/Bitbucket)
- [ ] MongoDB Atlas configuré
- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Render
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] Tests de connexion réussis
- [ ] HTTPS activé (automatique)
- [ ] Logs vérifiés
- [ ] Monitoring configuré (Sentry, etc.)

---

**🎉 Félicitations ! Votre plateforme Expérience Tech est maintenant déployée sur Render !**

