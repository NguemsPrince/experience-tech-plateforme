# 🚀 Référence Rapide - Déploiement Render

## 📋 Informations Essentielles

### URLs de Déploiement
- **Backend** : `https://experience-tech-backend.onrender.com`
- **Frontend** : `https://experience-tech-frontend.onrender.com`
- **API Health Check** : `https://experience-tech-backend.onrender.com/api/health`

---

## ⚙️ Configuration Backend (Render)

### Build & Start Commands
- **Root Directory** : `backend`
- **Build Command** : `npm install`
- **Start Command** : `npm start`

### Variables d'Environnement Obligatoires
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/experience_tech
JWT_SECRET=votre_secret_jwt_super_securise
JWT_REFRESH_SECRET=votre_refresh_secret_super_securise
CORS_ORIGIN=https://experience-tech-frontend.onrender.com
```

---

## 🎨 Configuration Frontend (Render)

### Option 1 : Static Site (Recommandé)
- **Type** : Static Site
- **Root Directory** : `frontend`
- **Build Command** : `npm install --legacy-peer-deps && npm run build`
- **Publish Directory** : `build`

### Option 2 : Web Service
- **Root Directory** : `frontend`
- **Build Command** : `npm install --legacy-peer-deps && npm run build`
- **Start Command** : `npx serve -s build -l $PORT`

### Variables d'Environnement Obligatoires
```env
REACT_APP_API_URL=https://experience-tech-backend.onrender.com/api
```

---

## 🔗 MongoDB Atlas

### Chaîne de Connexion
```
mongodb+srv://username:password@cluster.mongodb.net/experience_tech?retryWrites=true&w=majority
```

### Configuration Réseau
- Ajoutez `0.0.0.0/0` pour le développement
- Pour la production, limitez aux IPs de Render

---

## ✅ Checklist Rapide

1. [ ] Code poussé sur Git
2. [ ] MongoDB Atlas configuré
3. [ ] Backend créé sur Render
4. [ ] Frontend créé sur Render
5. [ ] Variables d'environnement configurées
6. [ ] CORS mis à jour avec les URLs Render
7. [ ] Tests de connexion réussis

---

## 🔍 Commandes Utiles

### Vérifier les Logs
- Render Dashboard > Service > Logs

### Redéployer
- Render Dashboard > Service > Manual Deploy

### Tester l'API
```bash
curl https://experience-tech-backend.onrender.com/api/health
```

---

## 📞 Support

- **Documentation** : `GUIDE_DEPLOIEMENT_RENDER.md`
- **Render Docs** : https://render.com/docs

