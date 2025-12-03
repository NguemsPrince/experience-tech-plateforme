# 📦 Informations de Déploiement Render - Plateforme Expérience Tech

## 🎯 Vue d'Ensemble

Ce document contient toutes les informations nécessaires pour déployer votre plateforme web dynamique **Expérience Tech** sur **Render**.

---

## 📁 Structure du Projet

```
Projet/
├── backend/              # API Node.js/Express
│   ├── server.js        # Point d'entrée principal
│   ├── package.json     # Dépendances backend
│   └── Procfile         # Configuration Render
├── frontend/            # Application React
│   ├── package.json     # Dépendances frontend
│   └── build/           # Dossier de build (généré)
├── render.yaml          # Configuration Blueprint Render
└── GUIDE_DEPLOIEMENT_RENDER.md  # Guide complet
```

---

## 🔧 Configuration Backend

### Informations Techniques

- **Langage** : Node.js
- **Framework** : Express.js
- **Base de données** : MongoDB (MongoDB Atlas recommandé)
- **Port** : Render assigne automatiquement (variable `PORT`)

### Commandes de Déploiement

- **Root Directory** : `backend`
- **Build Command** : `npm install`
- **Start Command** : `npm start`

### Variables d'Environnement Requises

#### Obligatoires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NODE_ENV` | Environnement | `production` |
| `PORT` | Port du serveur | `10000` (Render assigne automatiquement) |
| `MONGODB_URI` | URI de connexion MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/experience_tech` |
| `JWT_SECRET` | Secret pour JWT | `votre_secret_jwt_super_securise` |
| `JWT_REFRESH_SECRET` | Secret pour refresh token | `votre_refresh_secret_super_securise` |
| `CORS_ORIGIN` | Origines autorisées (séparées par virgules) | `https://experience-tech-frontend.onrender.com` |

#### Optionnelles (selon vos besoins)

| Variable | Description |
|----------|-------------|
| `JWT_EXPIRE` | Durée de validité JWT (défaut: `7d`) |
| `JWT_REFRESH_EXPIRE` | Durée de validité refresh token (défaut: `30d`) |
| `RATE_LIMIT_WINDOW_MS` | Fenêtre de rate limiting (défaut: `900000`) |
| `RATE_LIMIT_MAX_REQUESTS` | Nombre max de requêtes (défaut: `100`) |
| `EMAIL_HOST` | Serveur SMTP |
| `EMAIL_PORT` | Port SMTP (défaut: `587`) |
| `EMAIL_USER` | Email pour l'envoi |
| `EMAIL_PASS` | Mot de passe email |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `REDIS_URL` | URL Redis (si utilisé) |
| `SENTRY_DSN` | DSN Sentry pour le monitoring |
| `CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary |
| `FRESHDESK_DOMAIN` | Domaine Freshdesk |
| `FRESHDESK_API_KEY` | Clé API Freshdesk |

### Endpoints API Principaux

- **Health Check** : `/api/health`
- **Authentification** : `/api/auth`
- **Utilisateurs** : `/api/users`
- **Services** : `/api/services`
- **Produits** : `/api/products`
- **Formations** : `/api/training`
- **Paiements** : `/api/payments`
- **Documentation Swagger** : `/api-docs`

---

## 🎨 Configuration Frontend

### Informations Techniques

- **Framework** : React
- **Build Tool** : Create React App
- **Type de Déploiement** : Static Site (recommandé) ou Web Service

### Option 1 : Static Site (Recommandé)

- **Type** : Static Site
- **Root Directory** : `frontend`
- **Build Command** : `npm install --legacy-peer-deps && npm run build`
- **Publish Directory** : `build`

### Option 2 : Web Service

- **Type** : Web Service
- **Root Directory** : `frontend`
- **Build Command** : `npm install --legacy-peer-deps && npm run build`
- **Start Command** : `npx serve -s build -l $PORT`

**Note** : Pour l'option 2, vous devrez peut-être ajouter `serve` aux dépendances :
```bash
cd frontend
npm install serve --save
```

### Variables d'Environnement Requises

#### Obligatoires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `REACT_APP_API_URL` | URL de l'API backend | `https://experience-tech-backend.onrender.com/api` |

#### Optionnelles

| Variable | Description |
|----------|-------------|
| `REACT_APP_APP_NAME` | Nom de l'application (défaut: `Expérience Tech`) |
| `REACT_APP_VERSION` | Version de l'application |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `REACT_APP_GA_MEASUREMENT_ID` | ID Google Analytics |
| `REACT_APP_SENTRY_DSN` | DSN Sentry |
| `REACT_APP_AI_CHATBOT_ENABLED` | Activer le chatbot (défaut: `true`) |
| `REACT_APP_ANALYTICS_ENABLED` | Activer les analytics (défaut: `true`) |
| `REACT_APP_MONITORING_ENABLED` | Activer le monitoring (défaut: `true`) |
| `REACT_APP_CRM_ENABLED` | Activer le CRM (défaut: `true`) |

**⚠️ Important** : Toutes les variables React doivent commencer par `REACT_APP_`

---

## 🗄️ Configuration MongoDB

### MongoDB Atlas (Recommandé)

1. **Créer un compte** : [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Créer un cluster** (plan gratuit M0 disponible)
3. **Configurer l'accès réseau** :
   - Ajoutez `0.0.0.0/0` pour le développement
   - Pour la production, limitez aux IPs de Render
4. **Créer un utilisateur** avec un mot de passe fort
5. **Récupérer la chaîne de connexion** :
   ```
   mongodb+srv://username:password@cluster.mongodb.net/experience_tech?retryWrites=true&w=majority
   ```

### Format de la Chaîne de Connexion

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

---

## 🌐 Configuration CORS

Une fois déployé, configurez `CORS_ORIGIN` dans le backend avec les URLs de votre frontend :

```env
CORS_ORIGIN=https://experience-tech-frontend.onrender.com,https://www.votre-domaine.com
```

Vous pouvez ajouter plusieurs origines séparées par des virgules.

---

## 📝 Fichiers de Configuration

### render.yaml

Fichier de configuration Blueprint pour déploiement automatique. Contient :
- Configuration du service backend
- Configuration du service frontend
- Variables d'environnement de base
- Configuration de la base de données (optionnel)

### backend/Procfile

Fichier pour indiquer à Render comment démarrer le backend :
```
web: node server.js
```

---

## 🚀 Étapes de Déploiement

### 1. Préparation

- [ ] Code sur Git (GitHub/GitLab/Bitbucket)
- [ ] MongoDB Atlas configuré
- [ ] Clés API obtenues (Stripe, Sentry, etc.)

### 2. Déploiement Backend

1. Créer un nouveau Web Service sur Render
2. Connecter le repository
3. Configurer :
   - Root Directory : `backend`
   - Build Command : `npm install`
   - Start Command : `npm start`
4. Ajouter les variables d'environnement
5. Déployer

### 3. Déploiement Frontend

1. Créer un nouveau Static Site (ou Web Service) sur Render
2. Connecter le repository
3. Configurer :
   - Root Directory : `frontend`
   - Build Command : `npm install --legacy-peer-deps && npm run build`
   - Publish Directory : `build` (pour Static Site)
4. Ajouter les variables d'environnement
5. Déployer

### 4. Configuration Finale

- [ ] Mettre à jour `CORS_ORIGIN` avec l'URL du frontend
- [ ] Mettre à jour `REACT_APP_API_URL` avec l'URL du backend
- [ ] Tester les connexions
- [ ] Vérifier les logs

---

## ✅ Vérification

### Tests à Effectuer

1. **Backend Health Check**
   ```
   https://experience-tech-backend.onrender.com/api/health
   ```

2. **Frontend Access**
   ```
   https://experience-tech-frontend.onrender.com
   ```

3. **Connexion API**
   - Tester la connexion depuis le frontend
   - Vérifier la console du navigateur

4. **Fonctionnalités**
   - Connexion/Inscription
   - Navigation
   - Appels API
   - Upload de fichiers

---

## 🔍 Dépannage Rapide

### Backend ne démarre pas
- Vérifier les logs dans Render Dashboard
- Vérifier `MONGODB_URI`
- Vérifier que `PORT` est défini

### Erreur CORS
- Vérifier `CORS_ORIGIN` contient l'URL exacte du frontend
- Redéployer après modification

### Frontend ne se connecte pas
- Vérifier `REACT_APP_API_URL`
- Vérifier que le backend est accessible
- Vérifier la console du navigateur

### Erreur de build
- Tester le build localement
- Vérifier les dépendances
- Utiliser `--legacy-peer-deps` si nécessaire

---

## 📊 Plans et Coûts

### Plan Gratuit
- ✅ Backend : S'endort après 15 min d'inactivité
- ✅ Frontend : Déploiement statique gratuit
- ⚠️ Premier démarrage peut prendre 30-60 secondes

### Plan Starter (Recommandé Production)
- ✅ Backend : $7/mois - Toujours actif
- ✅ Frontend : Gratuit (statique)
- ✅ Support prioritaire

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **Guide Complet** : `GUIDE_DEPLOIEMENT_RENDER.md`
- **Référence Rapide** : `RENDER_DEPLOYMENT_QUICK_REFERENCE.md`
- **Documentation Render** : [https://render.com/docs](https://render.com/docs)

---

## 🔐 Sécurité

### Bonnes Pratiques

1. ✅ Ne jamais commiter les fichiers `.env`
2. ✅ Utiliser des secrets forts pour JWT
3. ✅ Limiter les origines CORS
4. ✅ HTTPS activé automatiquement sur Render
5. ✅ Utiliser des variables d'environnement pour tous les secrets
6. ✅ Activer l'authentification à 2 facteurs sur Render

---

## 📞 Support

- **Documentation Render** : [https://render.com/docs](https://render.com/docs)
- **Support Render** : support@render.com
- **Status Render** : [https://status.render.com](https://status.render.com)

---

**🎉 Votre plateforme est prête à être déployée sur Render !**

