# 📝 Instructions pour Remplir le Formulaire Render

## 🎯 Vous êtes sur : https://dashboard.render.com/web/new

---

## 🔙 DÉPLOIEMENT BACKEND (Premier Service)

### Étape 1 : Connecter le Repository

1. **Si votre code est sur GitHub/GitLab/Bitbucket :**
   - Cliquez sur **"Connect account"** ou le bouton de connexion
   - Choisissez votre provider (GitHub recommandé)
   - Autorisez Render
   - Sélectionnez votre repository

2. **Si votre code n'est pas encore sur Git :**
   - Ouvrez un terminal
   - Exécutez les commandes dans `GUIDE_ETAPE_PAR_ETAPE_RENDER.md`
   - Revenez ici après

---

### Étape 2 : Remplir le Formulaire

Voici **EXACTEMENT** ce que vous devez mettre dans chaque champ :

```
┌─────────────────────────────────────────────────────────┐
│ Name:                                                    │
│ experience-tech-backend                                  │
├─────────────────────────────────────────────────────────┤
│ Region:                                                  │
│ [Choisissez: Oregon, Frankfurt, ou Singapore]          │
├─────────────────────────────────────────────────────────┤
│ Branch:                                                  │
│ main                                                     │
├─────────────────────────────────────────────────────────┤
│ Root Directory:                                          │
│ backend                                                  │
│ ⚠️ TRÈS IMPORTANT : Ce champ doit être "backend"       │
├─────────────────────────────────────────────────────────┤
│ Runtime:                                                 │
│ Node (devrait être détecté automatiquement)             │
├─────────────────────────────────────────────────────────┤
│ Build Command:                                           │
│ npm install                                              │
├─────────────────────────────────────────────────────────┤
│ Start Command:                                           │
│ npm start                                                │
├─────────────────────────────────────────────────────────┤
│ Plan:                                                    │
│ [Free] pour commencer (gratuit)                         │
│ ou [Starter] pour production ($7/mois)                  │
└─────────────────────────────────────────────────────────┘
```

---

### Étape 3 : Ajouter les Variables d'Environnement

**AVANT de cliquer sur "Create Web Service"**, cherchez la section **"Environment Variables"** ou **"Advanced"**.

Cliquez sur **"Add Environment Variable"** et ajoutez ces variables **UNE PAR UNE** :

#### Variables OBLIGATOIRES :

```
Variable: NODE_ENV
Value: production
─────────────────────────────────────
Variable: PORT
Value: 10000
─────────────────────────────────────
Variable: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/experience_tech?retryWrites=true&w=majority
⚠️ Remplacez par votre vraie URI MongoDB Atlas
─────────────────────────────────────
Variable: JWT_SECRET
Value: votre_secret_jwt_super_securise_changez_moi_123456789
⚠️ Changez cette valeur par quelque chose de unique et sécurisé
─────────────────────────────────────
Variable: JWT_REFRESH_SECRET
Value: votre_refresh_secret_super_securise_changez_moi_987654321
⚠️ Changez cette valeur par quelque chose de unique et sécurisé
─────────────────────────────────────
Variable: CORS_ORIGIN
Value: https://experience-tech-frontend.onrender.com
⚠️ Vous mettrez à jour cette valeur après avoir créé le frontend
```

#### Variables OPTIONNELLES (vous pouvez les ajouter plus tard) :

```
Variable: JWT_EXPIRE
Value: 7d
─────────────────────────────────────
Variable: JWT_REFRESH_EXPIRE
Value: 30d
─────────────────────────────────────
Variable: RATE_LIMIT_WINDOW_MS
Value: 900000
─────────────────────────────────────
Variable: RATE_LIMIT_MAX_REQUESTS
Value: 100
```

---

### Étape 4 : Créer le Service

1. Vérifiez que tous les champs sont remplis correctement
2. Vérifiez que les variables d'environnement sont ajoutées
3. Cliquez sur **"Create Web Service"** en bas de la page
4. Attendez 5-10 minutes que le déploiement se termine
5. **NOTEZ L'URL** qui sera générée (ex: `https://experience-tech-backend-xxxx.onrender.com`)

---

## 🎨 DÉPLOIEMENT FRONTEND (Deuxième Service)

### Retourner au Dashboard

1. Cliquez sur **"New +"** en haut à droite
2. Cette fois, choisissez **"Static Site"** (pas "Web Service")

### Remplir le Formulaire Frontend

```
┌─────────────────────────────────────────────────────────┐
│ Name:                                                    │
│ experience-tech-frontend                                 │
├─────────────────────────────────────────────────────────┤
│ Repository:                                               │
│ [Sélectionnez le MÊME repository que pour le backend]    │
├─────────────────────────────────────────────────────────┤
│ Branch:                                                  │
│ main                                                     │
├─────────────────────────────────────────────────────────┤
│ Root Directory:                                          │
│ frontend                                                 │
│ ⚠️ TRÈS IMPORTANT : Ce champ doit être "frontend"       │
├─────────────────────────────────────────────────────────┤
│ Build Command:                                           │
│ npm install --legacy-peer-deps && npm run build         │
├─────────────────────────────────────────────────────────┤
│ Publish Directory:                                       │
│ build                                                    │
├─────────────────────────────────────────────────────────┤
│ Plan:                                                    │
│ Free (gratuit pour les sites statiques)                 │
└─────────────────────────────────────────────────────────┘
```

---

### Variables d'Environnement Frontend

Dans la section **"Environment Variables"**, ajoutez :

```
Variable: REACT_APP_API_URL
Value: https://experience-tech-backend-xxxx.onrender.com/api
⚠️ Remplacez "experience-tech-backend-xxxx" par l'URL RÉELLE de votre backend
⚠️ N'oubliez pas le "/api" à la fin
─────────────────────────────────────
Variable: REACT_APP_APP_NAME
Value: Expérience Tech
─────────────────────────────────────
Variable: REACT_APP_VERSION
Value: 1.0.0
```

---

### Créer le Site Statique

1. Vérifiez tous les champs
2. Cliquez sur **"Create Static Site"**
3. Attendez le déploiement
4. **NOTEZ L'URL** du frontend (ex: `https://experience-tech-frontend-xxxx.onrender.com`)

---

## 🔄 MISE À JOUR CORS

Une fois le frontend créé :

1. Retournez sur votre service **backend**
2. Allez dans l'onglet **"Environment"**
3. Trouvez la variable `CORS_ORIGIN`
4. Mettez à jour avec l'URL **EXACTE** de votre frontend :
   ```
   https://experience-tech-frontend-xxxx.onrender.com
   ```
5. Cliquez sur **"Save Changes"**
6. Render va redéployer automatiquement

---

## ✅ VÉRIFICATION RAPIDE

### Backend
Ouvrez dans votre navigateur :
```
https://experience-tech-backend-xxxx.onrender.com
```
Vous devriez voir un JSON avec les informations de l'API.

### Frontend
Ouvrez dans votre navigateur :
```
https://experience-tech-frontend-xxxx.onrender.com
```
Votre application devrait se charger.

---

## 🆘 SI VOUS ÊTES BLOQUÉ

Dites-moi :
1. **Sur quelle étape** vous êtes (quel champ du formulaire)
2. **Quel message d'erreur** vous voyez (si applicable)
3. **Ce que vous voyez** à l'écran

Je vous aiderai immédiatement ! 🚀

