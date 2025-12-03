# 🆓 MongoDB Gratuit sur Render - Guide Complet

## ✅ Solution 100% Gratuite

Render propose une **base de données MongoDB gratuite** ! Vous n'avez pas besoin de MongoDB Atlas.

---

## 🎯 ÉTAPE 1 : Créer la Base de Données MongoDB sur Render

### Sur le Dashboard Render

1. **Retournez sur votre Dashboard Render**
   - Allez sur https://dashboard.render.com

2. **Créer une Nouvelle Base de Données**
   - Cliquez sur **"+ New"** en haut à droite
   - Sélectionnez **"MongoDB"** dans le menu

3. **Configurer la Base de Données**

   Remplissez le formulaire :

   ```
   Name: experience-tech-mongodb
   Database Name: experience_tech
   User: experience_tech_user
   Region: [Même région que votre backend - Oregon, Frankfurt, ou Singapore]
   Plan: Free
   ```

4. **Créer la Base de Données**
   - Cliquez sur **"Create Database"**
   - Attendez 2-3 minutes que la base de données soit créée

---

## 🔗 ÉTAPE 2 : Récupérer la Chaîne de Connexion

Une fois la base de données créée :

1. **Cliquez sur votre base de données** dans la liste
2. Dans la section **"Connections"** ou **"Info"**, vous verrez :
   - **Internal Database URL** (pour les services dans la même région)
   - **External Database URL** (pour les connexions externes)

3. **Copiez l'Internal Database URL** (recommandé)
   - Elle ressemble à : `mongodb://experience_tech_user:PASSWORD@dpg-xxxxx-a.oregon-postgres.render.com/experience_tech`
   - Ou : `mongodb://dpg-xxxxx-a.oregon-postgres.render.com:27017/experience_tech`

4. **Notez le mot de passe** (affiché une seule fois lors de la création)

---

## ⚙️ ÉTAPE 3 : Connecter la Base de Données au Backend

### Option A : Via l'Interface Render (Recommandé)

1. **Allez sur votre service backend** dans Render
2. Cliquez sur l'onglet **"Environment"**
3. Trouvez la variable `MONGODB_URI`
4. **Si elle n'existe pas**, cliquez sur **"+ Add Environment Variable"**
5. Collez votre **Internal Database URL** complète
6. Cliquez sur **"Save Changes"**

### Option B : Via la Variable d'Environnement

Si Render vous donne une variable d'environnement automatique :

1. Dans votre service backend > **"Environment"**
2. Cherchez une variable comme `MONGODB_URI` ou `DATABASE_URL`
3. Si elle existe déjà, utilisez-la
4. Sinon, ajoutez-la manuellement avec l'URL complète

---

## 🔐 ÉTAPE 4 : Format de la Chaîne de Connexion

La chaîne de connexion Render ressemble généralement à :

```
mongodb://username:password@host:port/database_name
```

Exemple complet :
```
mongodb://experience_tech_user:VOTRE_MOT_DE_PASSE@dpg-xxxxx-a.oregon-postgres.render.com:27017/experience_tech
```

**⚠️ Important :**
- Remplacez `VOTRE_MOT_DE_PASSE` par le mot de passe affiché lors de la création
- Si vous avez perdu le mot de passe, vous devrez créer un nouvel utilisateur

---

## 🔄 ÉTAPE 5 : Lier la Base de Données au Service (Optionnel mais Recommandé)

Render permet de "lier" la base de données à votre service pour un accès automatique :

1. **Dans votre service backend**, allez dans **"Settings"**
2. Cherchez la section **"Linked Resources"** ou **"Add Resource"**
3. Cliquez sur **"Link Resource"**
4. Sélectionnez votre base de données MongoDB
5. Render créera automatiquement une variable d'environnement `MONGODB_URI` avec la bonne valeur

---

## ✅ ÉTAPE 6 : Vérifier la Connexion

1. **Redéployez votre backend** (si nécessaire)
2. **Vérifiez les logs** dans Render :
   - Allez dans votre service backend > **"Logs"**
   - Vous devriez voir : `MongoDB Connected: ...`

3. **Testez l'endpoint de santé** :
   ```
   https://votre-backend.onrender.com/api/health
   ```
   - La réponse devrait indiquer `mongodb: connected`

---

## 📋 Configuration Complète des Variables d'Environnement

Voici toutes les variables que vous devez avoir dans votre backend :

### Variables OBLIGATOIRES :

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb://experience_tech_user:PASSWORD@dpg-xxxxx-a.oregon-postgres.render.com:27017/experience_tech
JWT_SECRET=votre_secret_jwt_super_securise_123456789
JWT_REFRESH_SECRET=votre_refresh_secret_super_securise_987654321
CORS_ORIGIN=https://experience-tech-frontend.onrender.com
```

### Variables OPTIONNELLES :

```
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🆓 Avantages de MongoDB sur Render

✅ **100% Gratuit** (plan Free disponible)  
✅ **Pas besoin de compte externe** (tout est sur Render)  
✅ **Connexion privée** entre services (plus rapide et sécurisé)  
✅ **Gestion automatique** des sauvegardes  
✅ **Même région** que vos services (latence minimale)  

---

## ⚠️ Limitations du Plan Gratuit

- **512 MB de stockage** (suffisant pour commencer)
- **Pas de haute disponibilité** (mais fonctionne très bien pour la plupart des projets)
- **Pas de scaling automatique** (mais vous pouvez upgrader plus tard)

Pour la plupart des projets, c'est largement suffisant !

---

## 🔄 Si Vous Avez Déjà Créé le Backend

Si vous avez déjà créé votre service backend sans la base de données :

1. **Créez la base de données MongoDB** (Étape 1)
2. **Ajoutez `MONGODB_URI`** dans les variables d'environnement du backend
3. **Redéployez** ou attendez le redéploiement automatique
4. **Vérifiez les logs** pour confirmer la connexion

---

## 🆘 Dépannage

### Erreur : "Cannot connect to MongoDB"

**Solutions :**
1. Vérifiez que `MONGODB_URI` est correctement défini
2. Vérifiez que le mot de passe est correct
3. Vérifiez que la base de données est dans la même région que votre backend
4. Vérifiez les logs de la base de données dans Render

### Erreur : "Authentication failed"

**Solutions :**
1. Vérifiez le nom d'utilisateur et le mot de passe
2. Assurez-vous que vous utilisez l'**Internal Database URL** (pas External)
3. Vérifiez que le format de l'URL est correct

### La base de données ne s'affiche pas

**Solutions :**
1. Attendez quelques minutes (la création peut prendre du temps)
2. Rafraîchissez la page
3. Vérifiez que vous êtes sur le bon workspace

---

## 📝 Checklist Finale

- [ ] Base de données MongoDB créée sur Render
- [ ] Chaîne de connexion récupérée
- [ ] Variable `MONGODB_URI` ajoutée dans le backend
- [ ] Base de données liée au service (optionnel mais recommandé)
- [ ] Backend redéployé
- [ ] Logs vérifiés (connexion réussie)
- [ ] Endpoint `/api/health` testé (mongodb: connected)

---

## 🎉 C'est Tout !

Votre base de données MongoDB est maintenant configurée et **100% gratuite** sur Render !

**Pas besoin de MongoDB Atlas** - tout fonctionne directement sur Render. 🚀

---

## 📚 Prochaines Étapes

1. ✅ Créez la base de données MongoDB sur Render
2. ✅ Ajoutez `MONGODB_URI` dans votre backend
3. ✅ Continuez avec le déploiement du frontend
4. ✅ Testez votre application complète

**Besoin d'aide ?** Dites-moi à quelle étape vous êtes et je vous guiderai ! 😊

