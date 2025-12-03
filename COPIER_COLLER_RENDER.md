# 📋 Copier-Coller Rapide pour Render

## 🔙 BACKEND - Configuration à Copier

### Champs du Formulaire

**Name:**
```
experience-tech-backend
```

**Root Directory:**
```
backend
```

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

---

### Variables d'Environnement (à ajouter)

**Variable 1:**
```
Key: NODE_ENV
Value: production
```

**Variable 2:**
```
Key: PORT
Value: 10000
```

**Variable 3:**
```
Key: MONGODB_URI
Value: mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/experience_tech?retryWrites=true&w=majority
```
⚠️ Remplacez USERNAME et PASSWORD par vos identifiants MongoDB Atlas

**Variable 4:**
```
Key: JWT_SECRET
Value: changez_moi_par_un_secret_unique_et_securise_123456789
```
⚠️ Changez cette valeur !

**Variable 5:**
```
Key: JWT_REFRESH_SECRET
Value: changez_moi_par_un_autre_secret_unique_987654321
```
⚠️ Changez cette valeur !

**Variable 6:**
```
Key: CORS_ORIGIN
Value: https://experience-tech-frontend.onrender.com
```
⚠️ Vous mettrez à jour cette valeur après avoir créé le frontend

---

## 🎨 FRONTEND - Configuration à Copier

### Champs du Formulaire

**Name:**
```
experience-tech-frontend
```

**Root Directory:**
```
frontend
```

**Build Command:**
```
npm install --legacy-peer-deps && npm run build
```

**Publish Directory:**
```
build
```

---

### Variables d'Environnement (à ajouter)

**Variable 1:**
```
Key: REACT_APP_API_URL
Value: https://experience-tech-backend-XXXX.onrender.com/api
```
⚠️ Remplacez XXXX par l'ID réel de votre backend

**Variable 2:**
```
Key: REACT_APP_APP_NAME
Value: Expérience Tech
```

**Variable 3:**
```
Key: REACT_APP_VERSION
Value: 1.0.0
```

---

## 📝 Notes Importantes

1. **Root Directory** : C'est le champ le plus important ! 
   - Backend : `backend`
   - Frontend : `frontend`

2. **MongoDB URI** : Vous devez d'abord créer un compte sur MongoDB Atlas

3. **CORS_ORIGIN** : Mettez à jour après avoir créé le frontend

4. **REACT_APP_API_URL** : Mettez à jour avec l'URL réelle de votre backend

---

## ✅ Après le Déploiement

1. Notez les URLs générées
2. Mettez à jour `CORS_ORIGIN` dans le backend
3. Mettez à jour `REACT_APP_API_URL` dans le frontend
4. Testez les deux URLs dans votre navigateur

