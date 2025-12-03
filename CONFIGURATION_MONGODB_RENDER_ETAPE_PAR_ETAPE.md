# 🗄️ Configuration MongoDB Gratuit sur Render - Étape par Étape

## 🎯 Objectif

Configurer une base de données MongoDB **100% gratuite** directement sur Render, sans avoir besoin de MongoDB Atlas.

---

## 📍 ÉTAPE 1 : Aller sur le Dashboard Render

1. Ouvrez https://dashboard.render.com
2. Vous devriez voir votre workspace

---

## ➕ ÉTAPE 2 : Créer une Nouvelle Base de Données

1. **Cliquez sur le bouton "+ New"** en haut à droite
2. Dans le menu déroulant, **sélectionnez "MongoDB"**

   Vous verrez un formulaire pour créer la base de données.

---

## 📝 ÉTAPE 3 : Remplir le Formulaire

Remplissez le formulaire avec ces valeurs :

### Champs du Formulaire :

| Champ | Valeur à Entrer |
|-------|----------------|
| **Name** | `experience-tech-mongodb` |
| **Database Name** | `experience_tech` |
| **User** | `experience_tech_user` |
| **Region** | **Même région que votre backend** (Oregon, Frankfurt, ou Singapore) |
| **Plan** | `Free` |

### Détails :

- **Name** : C'est le nom de la ressource dans Render (peut être n'importe quoi)
- **Database Name** : C'est le nom réel de la base de données MongoDB
- **User** : Nom d'utilisateur pour se connecter
- **Region** : **IMPORTANT** - Choisissez la même région que votre backend pour une connexion plus rapide
- **Plan** : `Free` est gratuit et suffisant pour commencer

---

## 🔑 ÉTAPE 4 : Noter le Mot de Passe

**⚠️ TRÈS IMPORTANT :**

Lorsque vous créez la base de données, Render affichera un **mot de passe** pour l'utilisateur.

**COPIEZ ET GARDEZ CE MOT DE PASSE** - vous ne pourrez plus le voir après !

Exemple de ce que vous verrez :
```
Password: abc123xyz789
```

**Notez-le quelque part de sûr !**

---

## ⏳ ÉTAPE 5 : Attendre la Création

1. Cliquez sur **"Create Database"**
2. Attendez **2-3 minutes** que Render crée la base de données
3. Vous verrez un indicateur de progression

---

## 🔗 ÉTAPE 6 : Récupérer la Chaîne de Connexion

Une fois la base de données créée :

1. **Cliquez sur votre base de données** dans la liste des services
2. Vous verrez plusieurs onglets : **"Info"**, **"Connections"**, **"Logs"**, etc.

3. **Allez dans l'onglet "Info" ou "Connections"**
4. Vous verrez deux URLs :
   - **Internal Database URL** (pour les services dans la même région) ⭐ **UTILISEZ CELUI-CI**
   - **External Database URL** (pour les connexions externes)

5. **Copiez l'Internal Database URL**

   Elle ressemble à :
   ```
   mongodb://experience_tech_user:VOTRE_MOT_DE_PASSE@dpg-xxxxx-a.oregon-postgres.render.com:27017/experience_tech
   ```

   Ou parfois :
   ```
   mongodb://dpg-xxxxx-a.oregon-postgres.render.com:27017/experience_tech
   ```

6. **Remplacez `VOTRE_MOT_DE_PASSE`** par le mot de passe que vous avez noté à l'étape 4

---

## 🔄 ÉTAPE 7 : Lier la Base de Données au Backend (Recommandé)

Cette étape permet à Render de créer automatiquement la variable d'environnement :

### Méthode 1 : Depuis la Base de Données

1. **Dans la page de votre base de données**, cherchez la section **"Linked Resources"** ou **"Connect to Service"**
2. Cliquez sur **"Link Resource"** ou **"Connect"**
3. Sélectionnez votre service backend (`experience-tech-backend` ou `mon-projet`)
4. Render créera automatiquement la variable `MONGODB_URI` dans votre backend

### Méthode 2 : Depuis le Backend

1. **Allez sur votre service backend** dans Render
2. Allez dans **"Settings"** ou **"Environment"**
3. Cherchez **"Linked Resources"** ou **"Add Resource"**
4. Cliquez sur **"Link Resource"**
5. Sélectionnez votre base de données MongoDB
6. Render créera automatiquement la variable `MONGODB_URI`

---

## ⚙️ ÉTAPE 8 : Ajouter Manuellement MONGODB_URI (Si pas lié)

Si vous n'avez pas lié la base de données, ajoutez la variable manuellement :

1. **Allez sur votre service backend** dans Render
2. Cliquez sur l'onglet **"Environment"**
3. Cliquez sur **"+ Add Environment Variable"**
4. Ajoutez :
   - **Key** : `MONGODB_URI`
   - **Value** : Collez votre chaîne de connexion complète (avec le mot de passe)
5. Cliquez sur **"Save Changes"**

---

## ✅ ÉTAPE 9 : Vérifier la Connexion

1. **Attendez le redéploiement automatique** (ou redéployez manuellement)
2. **Allez dans les Logs** de votre backend :
   - Cliquez sur votre service backend
   - Allez dans l'onglet **"Logs"**
3. **Cherchez ces messages** :
   ```
   Connecting to MongoDB with URI: mongodb://...
   MongoDB Connected: dpg-xxxxx-a.oregon-postgres.render.com
   🚀 Server running in production mode on port 10000
   ```

4. **Testez l'endpoint de santé** :
   - Ouvrez : `https://votre-backend.onrender.com/api/health`
   - Vous devriez voir : `"mongodb": "connected"`

---

## 🎉 SUCCÈS !

Si vous voyez "MongoDB Connected" dans les logs, c'est que tout fonctionne ! 🎊

---

## 🆘 EN CAS DE PROBLÈME

### Problème : "Cannot connect to MongoDB"

**Solutions :**
1. Vérifiez que `MONGODB_URI` est bien défini dans les variables d'environnement
2. Vérifiez que le mot de passe dans l'URL est correct
3. Vérifiez que la base de données est dans la même région que le backend
4. Vérifiez les logs de la base de données (onglet "Logs" de la DB)

### Problème : "Authentication failed"

**Solutions :**
1. Vérifiez que le nom d'utilisateur est correct (`experience_tech_user`)
2. Vérifiez que le mot de passe est correct dans l'URL
3. Assurez-vous d'utiliser l'**Internal Database URL** (pas External)

### Problème : Je ne trouve pas l'Internal Database URL

**Solutions :**
1. Allez dans l'onglet **"Info"** de votre base de données
2. Cherchez **"Connection String"** ou **"Internal URL"**
3. Si vous ne la voyez pas, utilisez le format :
   ```
   mongodb://experience_tech_user:VOTRE_MOT_DE_PASSE@HOST:PORT/experience_tech
   ```
   - Remplacez `HOST` par l'hostname affiché
   - Remplacez `PORT` par le port (généralement 27017)
   - Remplacez `VOTRE_MOT_DE_PASSE` par votre mot de passe

---

## 📋 Format Final de MONGODB_URI

Votre variable `MONGODB_URI` devrait ressembler à :

```
mongodb://experience_tech_user:abc123xyz789@dpg-xxxxx-a.oregon-postgres.render.com:27017/experience_tech
```

Ou si Render utilise un format différent :

```
mongodb://dpg-xxxxx-a.oregon-postgres.render.com:27017/experience_tech?authSource=admin&authMechanism=SCRAM-SHA-256
```

Dans ce cas, vous devrez peut-être ajouter les credentials différemment. Consultez la documentation Render pour le format exact.

---

## ✅ Checklist Complète

- [ ] Base de données MongoDB créée sur Render
- [ ] Mot de passe noté et sauvegardé
- [ ] Internal Database URL récupérée
- [ ] Base de données liée au backend (ou variable ajoutée manuellement)
- [ ] Variable `MONGODB_URI` définie dans le backend
- [ ] Backend redéployé
- [ ] Logs vérifiés (connexion réussie)
- [ ] Endpoint `/api/health` testé

---

**🚀 Votre base de données MongoDB est maintenant configurée et 100% gratuite sur Render !**

Pas besoin de MongoDB Atlas - tout fonctionne directement sur Render. 😊

