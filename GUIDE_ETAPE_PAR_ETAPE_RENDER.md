# 🎯 Guide Étape par Étape - Configuration Render

## 📍 Vous êtes sur : https://dashboard.render.com/web/new

Ce guide vous accompagne champ par champ pour créer votre service sur Render.

---

## 🔙 ÉTAPE 1 : DÉPLOIEMENT DU BACKEND

### Sur la page "Create a new Web Service"

#### 1. Connecter votre Repository

**Option A : Si votre code est déjà sur GitHub/GitLab/Bitbucket**

1. Cliquez sur **"Connect account"** ou **"Connect repository"**
2. Choisissez votre provider (GitHub, GitLab, ou Bitbucket)
3. Autorisez Render à accéder à vos repositories
4. Sélectionnez votre repository qui contient le projet

**Option B : Si vous n'avez pas encore poussé votre code sur Git**

1. Ouvrez un terminal dans votre projet
2. Exécutez ces commandes :

```bash
cd /Users/nguemsprince/Desktop/Projet

# Initialiser Git si ce n'est pas déjà fait
git init

# Ajouter tous les fichiers (sauf .env)
git add .

# Créer un commit
git commit -m "Initial commit - Ready for Render"

# Créer un repository sur GitHub (allez sur github.com)
# Puis connectez-le :
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

Ensuite, revenez sur Render et connectez ce repository.

---

#### 2. Remplir le Formulaire de Configuration

Une fois votre repository connecté, vous verrez un formulaire. Remplissez-le comme suit :

### 📝 Champs du Formulaire

#### **Name** (Nom du service)
```
experience-tech-backend
```

#### **Region** (Région)
Choisissez la région la plus proche de vos utilisateurs :
- **Oregon (US West)** - Pour l'Amérique du Nord
- **Frankfurt (EU Central)** - Pour l'Europe
- **Singapore (AP Southeast)** - Pour l'Asie

#### **Branch** (Branche)
```
main
```
(ou `master` si c'est votre branche principale)

#### **Root Directory** ⚠️ IMPORTANT
```
backend
```
**C'est crucial !** Cela indique à Render où se trouve votre code backend.

#### **Runtime** (Environnement d'exécution)
```
Node
```
Render devrait le détecter automatiquement.

#### **Build Command** (Commande de build)
```
npm install
```

#### **Start Command** (Commande de démarrage)
```
npm start
```

#### **Plan** (Plan de service)
- Pour commencer : Choisissez **"Free"** (gratuit, mais s'endort après 15 min)
- Pour la production : Choisissez **"Starter"** ($7/mois, toujours actif)

---

#### 3. Variables d'Environnement

**⚠️ NE CLIQUEZ PAS ENCORE SUR "Create Web Service" !**

Avant de créer le service, vous devez ajouter les variables d'environnement. Cherchez la section **"Environment Variables"** ou **"Advanced"** et cliquez dessus.

Ajoutez ces variables **UNE PAR UNE** :

##### Variables OBLIGATOIRES (à ajouter maintenant) :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Environnement de production |
| `PORT` | `10000` | Port (Render l'ajustera automatiquement) |
| `MONGODB_URI` | `mongodb+srv://...` | **À remplir avec votre URI MongoDB Atlas** |
| `JWT_SECRET` | `votre_secret_jwt_super_securise_123456` | **Changez cette valeur !** |
| `JWT_REFRESH_SECRET` | `votre_refresh_secret_super_securise_123456` | **Changez cette valeur !** |
| `CORS_ORIGIN` | `https://experience-tech-frontend.onrender.com` | **À mettre à jour après le déploiement du frontend** |

##### Variables OPTIONNELLES (vous pouvez les ajouter plus tard) :

| Variable | Valeur par défaut |
|----------|------------------|
| `JWT_EXPIRE` | `7d` |
| `JWT_REFRESH_EXPIRE` | `30d` |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |

**Comment ajouter une variable :**
1. Cliquez sur **"Add Environment Variable"**
2. Entrez le **Key** (nom de la variable)
3. Entrez la **Value** (valeur)
4. Cliquez sur **"Add"**

---

#### 4. Créer le Service

Une fois toutes les variables ajoutées :

1. Cliquez sur **"Create Web Service"** en bas de la page
2. Render va commencer à déployer votre backend
3. Cela peut prendre 5-10 minutes

**⚠️ IMPORTANT :** Notez l'URL qui sera générée, par exemple :
```
https://experience-tech-backend.onrender.com
```

Vous en aurez besoin pour le frontend !

---

## 🎨 ÉTAPE 2 : DÉPLOIEMENT DU FRONTEND

### Retourner sur le Dashboard Render

1. Cliquez sur **"New +"** en haut à droite
2. Cette fois, choisissez **"Static Site"** (pas "Web Service")

### Remplir le Formulaire Frontend

#### **Name**
```
experience-tech-frontend
```

#### **Repository**
Sélectionnez le **même repository** que pour le backend

#### **Branch**
```
main
```

#### **Root Directory**
```
frontend
```

#### **Build Command**
```
npm install --legacy-peer-deps && npm run build
```

#### **Publish Directory**
```
build
```

#### **Plan**
Choisissez **"Free"** (les sites statiques sont gratuits)

---

### Variables d'Environnement Frontend

Dans la section **"Environment Variables"**, ajoutez :

| Variable | Valeur |
|----------|--------|
| `REACT_APP_API_URL` | `https://experience-tech-backend.onrender.com/api` |
| `REACT_APP_APP_NAME` | `Expérience Tech` |
| `REACT_APP_VERSION` | `1.0.0` |

**⚠️ Remplacez `experience-tech-backend.onrender.com` par l'URL réelle de votre backend !**

---

### Créer le Site Statique

1. Cliquez sur **"Create Static Site"**
2. Le déploiement va commencer
3. Notez l'URL du frontend, par exemple :
```
https://experience-tech-frontend.onrender.com
```

---

## 🔄 ÉTAPE 3 : MISE À JOUR DES CONFIGURATIONS

### Mettre à jour CORS dans le Backend

1. Retournez sur votre service backend dans Render
2. Allez dans **"Environment"** (onglet en haut)
3. Trouvez la variable `CORS_ORIGIN`
4. Mettez à jour la valeur avec l'URL de votre frontend :
```
https://experience-tech-frontend.onrender.com
```
5. Cliquez sur **"Save Changes"**
6. Render va redéployer automatiquement

---

## ✅ ÉTAPE 4 : VÉRIFICATION

### Tester le Backend

1. Ouvrez l'URL de votre backend dans un navigateur :
   ```
   https://experience-tech-backend.onrender.com
   ```
2. Vous devriez voir un JSON avec les informations de l'API

3. Testez l'endpoint de santé :
   ```
   https://experience-tech-backend.onrender.com/api/health
   ```

### Tester le Frontend

1. Ouvrez l'URL de votre frontend :
   ```
   https://experience-tech-frontend.onrender.com
   ```
2. La page devrait se charger
3. Ouvrez la console du navigateur (F12) pour vérifier les erreurs

---

## 🗄️ CONFIGURATION MONGODB ATLAS

Si vous n'avez pas encore configuré MongoDB Atlas :

### 1. Créer un Compte
- Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
- Créez un compte gratuit

### 2. Créer un Cluster
- Cliquez sur **"Build a Database"**
- Choisissez le plan **FREE (M0)**
- Sélectionnez une région
- Cliquez sur **"Create"**

### 3. Configurer l'Accès Réseau
- Allez dans **"Network Access"**
- Cliquez sur **"Add IP Address"**
- Cliquez sur **"Allow Access from Anywhere"** (pour le développement)
- Cliquez sur **"Confirm"**

### 4. Créer un Utilisateur
- Allez dans **"Database Access"**
- Cliquez sur **"Add New Database User"**
- Choisissez **"Password"** comme méthode d'authentification
- Entrez un nom d'utilisateur (ex: `experience_tech_user`)
- Générez un mot de passe fort (notez-le !)
- Donnez les permissions **"Read and write to any database"**
- Cliquez sur **"Add User"**

### 5. Récupérer la Chaîne de Connexion
- Allez dans **"Database"** > **"Connect"**
- Choisissez **"Connect your application"**
- Copiez la chaîne de connexion, elle ressemble à :
  ```
  mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Remplacez `<username>` par votre nom d'utilisateur
- Remplacez `<password>` par votre mot de passe
- Ajoutez le nom de la base de données à la fin :
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/experience_tech?retryWrites=true&w=majority
  ```

### 6. Ajouter dans Render
- Retournez sur Render > Votre service backend > Environment
- Trouvez `MONGODB_URI`
- Collez votre chaîne de connexion complète
- Cliquez sur **"Save Changes"**

---

## 🆘 EN CAS DE PROBLÈME

### Le build échoue

1. Allez dans **"Logs"** dans votre service Render
2. Lisez les erreurs
3. Vérifiez que :
   - Le **Root Directory** est correct (`backend` ou `frontend`)
   - Les commandes de build sont correctes
   - Toutes les dépendances sont dans `package.json`

### Le service ne démarre pas

1. Vérifiez les logs
2. Vérifiez que `MONGODB_URI` est correct
3. Vérifiez que toutes les variables obligatoires sont définies

### Erreur CORS

1. Vérifiez que `CORS_ORIGIN` contient l'URL exacte du frontend
2. Assurez-vous qu'il n'y a pas de `/` à la fin de l'URL
3. Redéployez le backend après modification

---

## 📋 CHECKLIST FINALE

- [ ] Backend créé et déployé
- [ ] Frontend créé et déployé
- [ ] MongoDB Atlas configuré
- [ ] `MONGODB_URI` ajouté dans le backend
- [ ] `REACT_APP_API_URL` pointant vers le backend
- [ ] `CORS_ORIGIN` mis à jour avec l'URL du frontend
- [ ] Backend accessible (test de l'URL)
- [ ] Frontend accessible (test de l'URL)
- [ ] Frontend se connecte au backend (vérifier la console)

---

## 🎉 FÉLICITATIONS !

Votre plateforme est maintenant déployée sur Render !

**URLs de votre plateforme :**
- Backend : `https://experience-tech-backend.onrender.com`
- Frontend : `https://experience-tech-frontend.onrender.com`

---

## 📞 BESOIN D'AIDE ?

Si vous êtes bloqué à une étape précise, dites-moi :
1. Sur quelle étape vous êtes
2. Quel message d'erreur vous voyez (si applicable)
3. Ce que vous voyez à l'écran

Je vous aiderai à résoudre le problème ! 🚀

