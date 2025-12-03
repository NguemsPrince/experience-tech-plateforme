# 🔧 Configuration Vercel : URL du Backend

## 🚨 Problème Identifié

Quand vous essayez de vous connecter sur Vercel, vous obtenez une erreur car le frontend essaie de se connecter à `http://localhost:5000/api`, ce qui ne fonctionne pas en production.

---

## ✅ Solution : Configurer l'URL du Backend dans Vercel

### Étape 1 : Trouver l'URL de votre Backend Déployé

Votre backend doit être déployé sur **Render** ou un autre service. Trouvez son URL :

#### Si le backend est sur Render :
1. Allez sur https://dashboard.render.com
2. Cliquez sur votre service backend (`experience-tech-backend`)
3. Copiez l'URL affichée en haut (ex: `https://experience-tech-backend.onrender.com`)

#### Si le backend n'est pas encore déployé :
👉 Voir la section "Déployer le Backend" ci-dessous

---

### Étape 2 : Configurer les Variables d'Environnement dans Vercel

1. **Allez sur Vercel Dashboard** : https://vercel.com/dashboard
2. **Sélectionnez votre projet** (`experience-tech-plateforme`)
3. **Allez dans** : **Settings** > **Environment Variables**
4. **Ajoutez cette variable** :

   | Name | Value |
   |------|-------|
   | `REACT_APP_API_URL` | `https://VOTRE-BACKEND-URL.onrender.com/api` |

   ⚠️ **Remplacez `VOTRE-BACKEND-URL`** par l'URL réelle de votre backend !

   **Exemple** :
   ```
   REACT_APP_API_URL=https://experience-tech-backend.onrender.com/api
   ```

5. **Sélectionnez les environnements** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

6. **Cliquez sur "Save"**

---

### Étape 3 : Redéployer sur Vercel

Après avoir ajouté la variable d'environnement :

1. **Allez dans** : **Deployments**
2. **Cliquez sur les 3 points** (⋯) du dernier déploiement
3. **Sélectionnez "Redeploy"**
4. **Vérifiez que la variable d'environnement est bien sélectionnée**
5. **Cliquez sur "Redeploy"**

---

## 🚀 Déployer le Backend sur Render (Si Pas Encore Fait)

Si votre backend n'est pas encore déployé, suivez ces étapes :

### 1. Préparer MongoDB Atlas

1. Allez sur https://www.mongodb.com/cloud/atlas
2. Créez un cluster gratuit (M0)
3. Créez un utilisateur de base de données
4. Configurez l'accès réseau (ajoutez `0.0.0.0/0` pour le développement)
5. Copiez la chaîne de connexion MongoDB

### 2. Créer le Service Backend sur Render

1. Allez sur https://dashboard.render.com/web/new
2. **Connectez votre repository GitHub**
3. **Remplissez le formulaire** :

   | Champ | Valeur |
   |-------|--------|
   | **Name** | `experience-tech-backend` |
   | **Root Directory** | `backend` ⚠️ IMPORTANT |
   | **Environment** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Plan** | `Free` |

4. **Ajoutez les Variables d'Environnement** :

   | Variable | Valeur |
   |----------|--------|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/experience_tech` |
   | `JWT_SECRET` | `votre_secret_jwt_unique_123456` |
   | `JWT_REFRESH_SECRET` | `votre_refresh_secret_unique_789012` |
   | `CORS_ORIGIN` | `https://votre-frontend.vercel.app` |

5. **Cliquez sur "Create Web Service"**

6. **Attendez que le déploiement se termine** (5-10 minutes)

7. **Copiez l'URL du backend** (ex: `https://experience-tech-backend.onrender.com`)

### 3. Mettre à Jour CORS dans le Backend

Une fois le frontend déployé sur Vercel, mettez à jour `CORS_ORIGIN` dans Render :

1. Allez sur votre service backend dans Render
2. **Settings** > **Environment Variables**
3. **Modifiez `CORS_ORIGIN`** avec l'URL de votre frontend Vercel :
   ```
   https://votre-projet.vercel.app
   ```
4. **Redéployez** le backend

---

## 🔍 Vérification

### Vérifier que le Backend Fonctionne

1. **Testez l'endpoint de santé** :
   ```
   https://VOTRE-BACKEND-URL.onrender.com/api/health
   ```
   Vous devriez voir une réponse JSON.

2. **Vérifiez les logs Render** :
   - Allez sur votre service backend dans Render
   - Cliquez sur "Logs"
   - Vérifiez qu'il n'y a pas d'erreurs

### Vérifier que le Frontend Utilise la Bonne URL

1. **Ouvrez la console du navigateur** (F12)
2. **Allez sur votre site Vercel**
3. **Essayez de vous connecter**
4. **Regardez les requêtes réseau** :
   - Elles devraient aller vers `https://VOTRE-BACKEND-URL.onrender.com/api/...`
   - Pas vers `http://localhost:5000/api`

---

## 📋 Checklist Complète

- [ ] Backend déployé sur Render (ou autre service)
- [ ] MongoDB Atlas configuré et accessible
- [ ] Variables d'environnement backend configurées dans Render
- [ ] `REACT_APP_API_URL` configurée dans Vercel avec l'URL du backend
- [ ] CORS configuré dans le backend avec l'URL du frontend Vercel
- [ ] Frontend redéployé sur Vercel
- [ ] Test de connexion réussi

---

## 🆘 Problèmes Courants

### Erreur : "Network Error" ou "CORS Error"

**Solution** :
1. Vérifiez que `CORS_ORIGIN` dans Render contient l'URL exacte de votre frontend Vercel
2. Redéployez le backend après avoir modifié CORS

### Erreur : "Backend not accessible"

**Solution** :
1. Vérifiez que le backend est bien démarré sur Render (regardez les logs)
2. Vérifiez que l'URL dans `REACT_APP_API_URL` est correcte
3. Testez l'URL du backend directement dans le navigateur

### Erreur : "MongoDB connection failed"

**Solution** :
1. Vérifiez que `MONGODB_URI` est correcte dans Render
2. Vérifiez que MongoDB Atlas autorise les connexions depuis Render (IP `0.0.0.0/0`)

---

## 📚 Documentation Supplémentaire

- **Guide Render** : `GUIDE_DEPLOIEMENT_RENDER.md`
- **Configuration MongoDB** : `CONFIGURATION_MONGODB_RENDER_ETAPE_PAR_ETAPE.md`
- **Référence Rapide Render** : `RENDER_DEPLOYMENT_QUICK_REFERENCE.md`

---

✅ **Une fois ces étapes terminées, votre application devrait fonctionner correctement !**

