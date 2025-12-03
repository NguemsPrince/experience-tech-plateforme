# ⚡ Solution Rapide : Erreur Backend sur Vercel

## 🚨 Problème

Vous avez créé un compte via le frontend déployé sur Vercel, mais lors de la connexion, vous obtenez une erreur de démarrage du serveur backend.

**Cause** : Le frontend essaie de se connecter à `http://localhost:5000/api` qui n'existe pas en production.

---

## ✅ Solution en 3 Étapes

### Étape 1 : Trouver l'URL de votre Backend

**Option A : Backend déjà déployé sur Render**
1. Allez sur https://dashboard.render.com
2. Cliquez sur votre service backend
3. Copiez l'URL affichée (ex: `https://experience-tech-backend.onrender.com`)

**Option B : Backend pas encore déployé**
👉 Passez directement à l'Étape 2 pour déployer le backend

---

### Étape 2 : Configurer Vercel (2 minutes)

1. **Allez sur** : https://vercel.com/dashboard
2. **Cliquez sur votre projet** (`experience-tech-plateforme`)
3. **Allez dans** : **Settings** (⚙️) > **Environment Variables**
4. **Cliquez sur "Add New"**
5. **Remplissez** :
   - **Name** : `REACT_APP_API_URL`
   - **Value** : `https://VOTRE-BACKEND-URL.onrender.com/api`
     - ⚠️ Remplacez `VOTRE-BACKEND-URL` par l'URL réelle !
   - **Environments** : Cochez ✅ Production, ✅ Preview, ✅ Development
6. **Cliquez sur "Save"**

**Exemple de valeur** :
```
https://experience-tech-backend.onrender.com/api
```

---

### Étape 3 : Redéployer

1. **Allez dans** : **Deployments**
2. **Cliquez sur les 3 points** (⋯) du dernier déploiement
3. **Sélectionnez "Redeploy"**
4. **Cliquez sur "Redeploy"**

Attendez 2-3 minutes que le déploiement se termine.

---

## 🚀 Si le Backend n'est Pas Encore Déployé

### Déployer le Backend sur Render (10 minutes)

#### 1. Préparer MongoDB Atlas

1. Allez sur https://www.mongodb.com/cloud/atlas
2. Créez un compte gratuit
3. Créez un cluster gratuit (M0)
4. Cliquez sur "Connect" > "Connect your application"
5. Copiez la chaîne de connexion (ex: `mongodb+srv://user:pass@cluster.mongodb.net/experience_tech`)

#### 2. Créer le Service sur Render

1. Allez sur https://dashboard.render.com/web/new
2. **Connectez GitHub** et sélectionnez votre repository
3. **Remplissez** :

   | Champ | Valeur |
   |-------|--------|
   | **Name** | `experience-tech-backend` |
   | **Root Directory** | `backend` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |

4. **Ajoutez ces Variables** (cliquez sur "Advanced" > "Add Environment Variable") :

   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/experience_tech
   JWT_SECRET=votre_secret_unique_123456789
   JWT_REFRESH_SECRET=votre_autre_secret_987654321
   CORS_ORIGIN=https://votre-projet.vercel.app
   ```

   ⚠️ **Remplacez** :
   - `mongodb+srv://user:pass@cluster...` par votre chaîne MongoDB
   - `votre_secret_unique_123456789` par un secret aléatoire
   - `https://votre-projet.vercel.app` par l'URL de votre frontend Vercel

5. **Cliquez sur "Create Web Service"**
6. **Attendez 5-10 minutes** que le déploiement se termine
7. **Copiez l'URL** du backend (ex: `https://experience-tech-backend.onrender.com`)

#### 3. Mettre à Jour Vercel

Une fois le backend déployé, suivez l'**Étape 2** ci-dessus pour configurer `REACT_APP_API_URL` dans Vercel.

---

## 🔍 Vérification

### Test 1 : Backend Accessible ?

Ouvrez dans votre navigateur :
```
https://VOTRE-BACKEND-URL.onrender.com/api/health
```

Vous devriez voir une réponse JSON. Si vous voyez une erreur, le backend n'est pas démarré correctement.

### Test 2 : Frontend Utilise la Bonne URL ?

1. Ouvrez votre site Vercel
2. Ouvrez la console du navigateur (F12)
3. Allez dans l'onglet "Network"
4. Essayez de vous connecter
5. Regardez les requêtes : elles devraient aller vers `https://...onrender.com/api/...`

---

## ⚠️ Important

- **CORS** : Assurez-vous que `CORS_ORIGIN` dans Render contient l'URL exacte de votre frontend Vercel
- **MongoDB** : Configurez l'accès réseau dans MongoDB Atlas pour autoriser les connexions depuis Render (ajoutez `0.0.0.0/0`)
- **Secrets** : Utilisez des secrets uniques et sécurisés pour `JWT_SECRET` et `JWT_REFRESH_SECRET`

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

1. **Vérifiez les logs Render** :
   - Allez sur votre service backend dans Render
   - Cliquez sur "Logs"
   - Cherchez les erreurs

2. **Vérifiez les logs Vercel** :
   - Allez sur votre projet dans Vercel
   - Cliquez sur le dernier déploiement
   - Regardez les "Build Logs"

3. **Vérifiez la console du navigateur** :
   - Ouvrez F12 sur votre site Vercel
   - Regardez les erreurs dans la console

---

✅ **Une fois `REACT_APP_API_URL` configurée et le projet redéployé, tout devrait fonctionner !**

