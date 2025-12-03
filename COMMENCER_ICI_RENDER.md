# 🚀 COMMENCEZ ICI - Déploiement Render

## 📍 Vous êtes sur : https://dashboard.render.com/web/new

---

## ⚡ DÉMARRAGE RAPIDE

### ÉTAPE 1 : Connecter votre Code

**Si votre code est déjà sur GitHub :**
1. Cliquez sur **"Connect account"** ou le bouton de connexion
2. Choisissez **GitHub**
3. Autorisez Render
4. Sélectionnez votre repository

**Si votre code n'est pas sur GitHub :**
👉 Voir la section "Préparer Git" ci-dessous

---

### ÉTAPE 2 : Remplir le Formulaire Backend

Copiez-collez ces valeurs **EXACTEMENT** comme indiqué :

| Champ | Valeur à Entrer |
|-------|----------------|
| **Name** | `experience-tech-backend` |
| **Region** | Choisissez une région (Oregon, Frankfurt, ou Singapore) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ TRÈS IMPORTANT |
| **Runtime** | `Node` (détecté automatiquement) |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` (pour commencer) |

---

### ÉTAPE 3 : Ajouter les Variables d'Environnement

**AVANT de cliquer sur "Create Web Service"**, cherchez **"Environment Variables"** ou **"Advanced"**.

Ajoutez ces 6 variables (une par une) :

1. **NODE_ENV** = `production`
2. **PORT** = `10000`
3. **MONGODB_URI** = `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/experience_tech?retryWrites=true&w=majority`
   - ⚠️ Remplacez USERNAME et PASSWORD par vos identifiants MongoDB Atlas
   - Si vous n'avez pas MongoDB Atlas, voir la section "Configurer MongoDB" ci-dessous
4. **JWT_SECRET** = `changez_moi_par_un_secret_unique_123456789`
   - ⚠️ Changez cette valeur par quelque chose d'unique et sécurisé
5. **JWT_REFRESH_SECRET** = `changez_moi_par_un_autre_secret_987654321`
   - ⚠️ Changez cette valeur par quelque chose d'unique et sécurisé
6. **CORS_ORIGIN** = `https://experience-tech-frontend.onrender.com`
   - ⚠️ Vous mettrez à jour cette valeur après avoir créé le frontend

---

### ÉTAPE 4 : Créer le Backend

1. Vérifiez tous les champs
2. Cliquez sur **"Create Web Service"**
3. Attendez 5-10 minutes
4. **NOTEZ L'URL** qui sera générée (ex: `https://experience-tech-backend-abc123.onrender.com`)

---

### ÉTAPE 5 : Créer le Frontend

1. Retournez au dashboard Render
2. Cliquez sur **"New +"** > **"Static Site"**
3. Remplissez le formulaire :

| Champ | Valeur à Entrer |
|-------|----------------|
| **Name** | `experience-tech-frontend` |
| **Repository** | Même repository que le backend |
| **Branch** | `main` |
| **Root Directory** | `frontend` ⚠️ TRÈS IMPORTANT |
| **Build Command** | `npm install --legacy-peer-deps && npm run build` |
| **Publish Directory** | `build` |
| **Plan** | `Free` |

4. Ajoutez les variables d'environnement :
   - **REACT_APP_API_URL** = `https://experience-tech-backend-abc123.onrender.com/api`
     - ⚠️ Remplacez `abc123` par l'ID réel de votre backend
   - **REACT_APP_APP_NAME** = `Expérience Tech`
   - **REACT_APP_VERSION** = `1.0.0`

5. Cliquez sur **"Create Static Site"**
6. **NOTEZ L'URL** du frontend

---

### ÉTAPE 6 : Mettre à Jour CORS

1. Retournez sur votre service **backend**
2. Allez dans **"Environment"**
3. Trouvez `CORS_ORIGIN`
4. Mettez à jour avec l'URL **EXACTE** de votre frontend
5. Cliquez sur **"Save Changes"**

---

## 🗄️ CONFIGURER MONGODB GRATUITEMENT (2 Options)

### 🆓 OPTION 1 : MongoDB Atlas (100% Gratuit - RECOMMANDÉ) ⭐

**✅ C'est la solution la plus simple et la plus fiable !**

**⚠️ Note :** Render ne propose pas MongoDB comme service géré. MongoDB Atlas est la meilleure option gratuite.

1. **Créer un Compte MongoDB Atlas**
   - Allez sur https://www.mongodb.com/atlas
   - Cliquez sur **"Try Free"** ou **"Get started free"**
   - Créez un compte (gratuit)

2. **Créer un Cluster Gratuit**
   - Cliquez sur **"Build a Database"**
   - Choisissez **"M0 FREE"** (plan gratuit)
   - Sélectionnez une région
   - Cliquez sur **"Create"**
   - Attendez 3-5 minutes

3. **Configurer l'Accès Réseau**
   - Allez dans **"Network Access"**
   - Cliquez sur **"Add IP Address"**
   - Cliquez sur **"Allow Access from Anywhere"**
   - Cliquez sur **"Confirm"**

4. **Créer un Utilisateur**
   - Allez dans **"Database Access"**
   - Cliquez sur **"Add New Database User"**
   - Entrez un nom d'utilisateur (ex: `experience_tech_user`)
   - Générez un mot de passe fort - **NOTEZ-LE !**
   - Cliquez sur **"Add User"**

5. **Récupérer la Chaîne de Connexion**
   - Allez dans **"Database"** > **"Connect"**
   - Choisissez **"Connect your application"**
   - Copiez la chaîne de connexion
   - Remplacez `<username>` et `<password>`
   - Ajoutez `/experience_tech` avant le `?`
   - Exemple :
     ```
     mongodb+srv://experience_tech_user:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/experience_tech?retryWrites=true&w=majority
     ```

6. **Ajouter dans Render**
   - Render > Backend > Environment
   - Ajoutez `MONGODB_URI` avec votre chaîne de connexion
   - Cliquez sur **"Save Changes"**

**📚 Guide complet :** `MONGODB_OPTIONS_GRATUITES.md`

---

### 🌐 OPTION 2 : MongoDB Atlas (Gratuit aussi, mais externe)

Si vous préférez utiliser MongoDB Atlas :

1. **Créer un Compte**
   - Allez sur https://www.mongodb.com/atlas
   - Créez un compte gratuit (plan M0 gratuit disponible)

2. **Créer un Cluster**
   - Cliquez sur **"Build a Database"**
   - Choisissez **FREE (M0)**
   - Sélectionnez une région
   - Cliquez sur **"Create"**

3. **Configurer l'Accès Réseau**
   - Allez dans **"Network Access"**
   - Cliquez sur **"Add IP Address"**
   - Cliquez sur **"Allow Access from Anywhere"**
   - Cliquez sur **"Confirm"**

4. **Créer un Utilisateur**
   - Allez dans **"Database Access"**
   - Cliquez sur **"Add New Database User"**
   - Entrez un nom d'utilisateur (ex: `experience_tech_user`)
   - Générez un mot de passe fort (NOTEZ-LE !)
   - Cliquez sur **"Add User"**

5. **Récupérer la Chaîne de Connexion**
   - Allez dans **"Database"** > **"Connect"**
   - Choisissez **"Connect your application"**
   - Copiez la chaîne de connexion
   - Remplacez `<password>` par votre mot de passe
   - Ajoutez `/experience_tech` avant le `?`
   - Exemple final :
     ```
     mongodb+srv://experience_tech_user:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/experience_tech?retryWrites=true&w=majority
     ```

6. **Ajouter dans Render**
   - Retournez sur Render > Backend > Environment
   - Trouvez `MONGODB_URI`
   - Collez votre chaîne de connexion complète
   - Cliquez sur **"Save Changes"**

---

**💡 Recommandation :** Utilisez l'**Option 1 (MongoDB sur Render)** - c'est plus simple, plus rapide, et tout est au même endroit !

---

## 📦 PRÉPARER GIT (Si code pas encore sur GitHub)

Ouvrez un terminal et exécutez :

```bash
cd /Users/nguemsprince/Desktop/Projet

# Initialiser Git
git init

# Ajouter les fichiers (sauf .env)
git add .

# Créer un commit
git commit -m "Initial commit - Ready for Render"

# Créer un repository sur GitHub.com
# Puis connectez-le :
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

Ensuite, revenez sur Render et connectez ce repository.

---

## ✅ VÉRIFICATION

### Backend
Ouvrez dans votre navigateur :
```
https://experience-tech-backend-XXXX.onrender.com
```
Vous devriez voir un JSON avec les informations de l'API.

### Frontend
Ouvrez dans votre navigateur :
```
https://experience-tech-frontend-XXXX.onrender.com
```
Votre application devrait se charger.

---

## 🆘 BESOIN D'AIDE ?

Si vous êtes bloqué, dites-moi :
1. **Sur quelle étape** vous êtes
2. **Quel message d'erreur** vous voyez
3. **Ce que vous voyez** à l'écran

Je vous aiderai immédiatement ! 🚀

---

## 📚 DOCUMENTS DE RÉFÉRENCE

- **Guide Complet** : `GUIDE_ETAPE_PAR_ETAPE_RENDER.md`
- **Instructions Détaillées** : `INSTRUCTIONS_RENDER_FORMULAIRE.md`
- **Copier-Coller Rapide** : `COPIER_COLLER_RENDER.md`

