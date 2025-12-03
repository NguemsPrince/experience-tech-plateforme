# ⚠️ CORRECTIONS URGENTES - Configuration Render

## 🚨 PROBLÈMES IDENTIFIÉS

D'après vos captures d'écran, voici ce qui doit être corrigé **AVANT** de cliquer sur "Deploy Web Service" :

---

## ❌ PROBLÈME 1 : Language = "Docker" (MAUVAIS)

**Ce que je vois :** Language est sur "Docker"  
**Ce que ça devrait être :** "Node"

### 🔧 CORRECTION :

1. Cliquez sur le champ **"Language"** (celui qui affiche "Docker")
2. Dans le menu déroulant, sélectionnez **"Node"** (pas Docker)
3. Cela va changer toute la configuration pour un service Node.js

**Pourquoi c'est important :** Votre projet est Node.js/Express, pas Docker. Si vous laissez "Docker", Render cherchera un Dockerfile qui n'existe pas et le déploiement échouera.

---

## ❌ PROBLÈME 2 : Dockerfile Path rempli

**Ce que je vois :** "Dockerfile Path" contient `backend / .`  
**Ce que ça devrait être :** Vide (laissé vide)

### 🔧 CORRECTION :

1. Une fois que vous avez changé Language en "Node", le champ "Dockerfile Path" devrait disparaître
2. Si il est toujours là, **videz-le complètement**

---

## ❌ PROBLÈME 3 : Health Check Path incorrect

**Ce que je vois :** Health Check Path = `/healthz`  
**Ce que ça devrait être :** `/api/health`

### 🔧 CORRECTION :

1. Trouvez la section **"Health Check Path"**
2. Changez la valeur de `/healthz` à `/api/health`
3. C'est l'endpoint que votre serveur utilise réellement

---

## ❌ PROBLÈME 4 : Variables d'environnement manquantes

**Ce que je vois :** Seulement `NODE_ENV` et `PORT` sont présents  
**Ce qui manque :** Les variables essentielles

### 🔧 CORRECTION :

Cliquez sur **"+ Add Environment Variable"** et ajoutez **TOUTES** ces variables :

#### Variables OBLIGATOIRES :

```
1. Key: MONGODB_URI
   Value: mongodb://experience_tech_user:PASSWORD@dpg-xxxxx-a.oregon-postgres.render.com:27017/experience_tech
   ⚠️ Utilisez l'Internal Database URL de votre base MongoDB Render
   ⚠️ Voir MONGODB_GRATUIT_RENDER.md pour créer la base de données gratuitement sur Render

2. Key: JWT_SECRET
   Value: changez_moi_par_un_secret_unique_et_securise_123456789
   ⚠️ Changez cette valeur !

3. Key: JWT_REFRESH_SECRET
   Value: changez_moi_par_un_autre_secret_unique_987654321
   ⚠️ Changez cette valeur !

4. Key: CORS_ORIGIN
   Value: https://experience-tech-frontend.onrender.com
   ⚠️ Vous mettrez à jour cette valeur après avoir créé le frontend
```

---

## ✅ CE QUI EST DÉJÀ BON

- ✅ Repository connecté : "NguemsPrince / Mon-projet"
- ✅ Branch : "main"
- ✅ Root Directory : "backend"
- ✅ Region : "Oregon (US West)"
- ✅ Instance Type : "Free"
- ✅ Auto-Deploy : "On Commit"
- ✅ NODE_ENV et PORT sont présents

---

## 📋 CHECKLIST AVANT DE DÉPLOYER

Avant de cliquer sur **"Deploy Web Service"**, vérifiez :

- [ ] **Language** = "Node" (pas Docker)
- [ ] **Dockerfile Path** = Vide (ou n'existe plus)
- [ ] **Health Check Path** = `/api/health`
- [ ] **Root Directory** = `backend`
- [ ] **MONGODB_URI** ajouté dans Environment Variables
- [ ] **JWT_SECRET** ajouté dans Environment Variables
- [ ] **JWT_REFRESH_SECRET** ajouté dans Environment Variables
- [ ] **CORS_ORIGIN** ajouté dans Environment Variables (même si vous le mettrez à jour plus tard)

---

## 🎯 ACTIONS IMMÉDIATES

### Étape 1 : Changer Language
1. Cliquez sur le champ "Language" (actuellement "Docker")
2. Sélectionnez **"Node"** dans le menu
3. Attendez que la page se mette à jour

### Étape 2 : Vérifier les champs
1. Vérifiez que "Dockerfile Path" a disparu (ou videz-le)
2. Changez "Health Check Path" en `/api/health`

### Étape 3 : Ajouter les variables
1. Cliquez sur **"+ Add Environment Variable"**
2. Ajoutez les 4 variables obligatoires une par une
3. Pour MONGODB_URI, utilisez votre vraie URI MongoDB Atlas

### Étape 4 : Déployer
1. Vérifiez la checklist ci-dessus
2. Cliquez sur **"Deploy Web Service"**

---

## 🆘 CONFIGURER MONGODB GRATUITEMENT SUR RENDER

**✅ BONNE NOUVELLE :** Vous n'avez pas besoin de MongoDB Atlas ! Render propose une base de données MongoDB **100% gratuite** !

**Pour configurer MongoDB gratuitement :**
1. Consultez le guide complet : `MONGODB_GRATUIT_RENDER.md`
2. Ou le guide étape par étape : `CONFIGURATION_MONGODB_RENDER_ETAPE_PAR_ETAPE.md`

**Résumé rapide :**
1. Sur Render Dashboard, cliquez sur "+ New" > "MongoDB"
2. Créez la base de données (plan Free)
3. Récupérez l'Internal Database URL
4. Ajoutez-la dans `MONGODB_URI` de votre backend

**C'est tout ! Pas besoin de compte externe, tout est gratuit sur Render !** 🎉

---

## ✅ APRÈS LE DÉPLOIEMENT

Une fois le backend déployé :

1. **Notez l'URL** générée (ex: `https://mon-projet-abc123.onrender.com`)
2. **Testez l'endpoint** : `https://mon-projet-abc123.onrender.com/api/health`
3. **Créez le frontend** (voir `COMMENCER_ICI_RENDER.md`)
4. **Mettez à jour CORS_ORIGIN** avec l'URL du frontend

---

**🚀 Une fois ces corrections faites, vous pourrez déployer en toute sécurité !**

