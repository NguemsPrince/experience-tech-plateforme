# 🆓 Options MongoDB Gratuites - Guide Complet

## ⚠️ Information Importante

**Render ne propose PAS MongoDB comme service géré** (comme Postgres). Mais il existe **3 solutions gratuites** pour vous !

---

## 🎯 OPTION 1 : MongoDB Atlas (Gratuit - RECOMMANDÉ) ⭐

**✅ C'est la solution la plus simple et la plus fiable !**

MongoDB Atlas propose un **plan M0 100% gratuit** qui est parfait pour commencer.

### Avantages :
- ✅ **100% Gratuit** (plan M0)
- ✅ **512 MB de stockage** (suffisant pour commencer)
- ✅ **Très facile à configurer**
- ✅ **Fiable et stable**
- ✅ **Gestion automatique** des sauvegardes
- ✅ **Interface graphique** pour gérer vos données

### Inconvénients :
- ⚠️ Nécessite un compte externe (mais c'est gratuit)
- ⚠️ Limité à 512 MB (mais suffisant pour la plupart des projets)

### Comment Configurer :

1. **Créer un Compte MongoDB Atlas**
   - Allez sur https://www.mongodb.com/atlas
   - Cliquez sur **"Try Free"** ou **"Get started free"**
   - Créez un compte (gratuit)

2. **Créer un Cluster Gratuit**
   - Une fois connecté, cliquez sur **"Build a Database"**
   - Choisissez **"M0 FREE"** (le plan gratuit)
   - Sélectionnez une région (choisissez la plus proche de vos utilisateurs)
   - Cliquez sur **"Create"**
   - Attendez 3-5 minutes que le cluster soit créé

3. **Configurer l'Accès Réseau**
   - Allez dans **"Network Access"** (menu de gauche)
   - Cliquez sur **"Add IP Address"**
   - Cliquez sur **"Allow Access from Anywhere"** (pour le développement)
   - Cliquez sur **"Confirm"**

4. **Créer un Utilisateur de Base de Données**
   - Allez dans **"Database Access"** (menu de gauche)
   - Cliquez sur **"Add New Database User"**
   - Choisissez **"Password"** comme méthode d'authentification
   - Entrez un nom d'utilisateur (ex: `experience_tech_user`)
   - Générez un mot de passe fort (ou créez-en un) - **NOTEZ-LE !**
   - Donnez les permissions **"Read and write to any database"**
   - Cliquez sur **"Add User"**

5. **Récupérer la Chaîne de Connexion**
   - Allez dans **"Database"** (menu de gauche)
   - Cliquez sur **"Connect"** sur votre cluster
   - Choisissez **"Connect your application"**
   - Copiez la chaîne de connexion
   - Elle ressemble à :
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Remplacez `<username>`** par votre nom d'utilisateur
   - **Remplacez `<password>`** par votre mot de passe
   - **Ajoutez le nom de la base de données** avant le `?` :
     ```
     mongodb+srv://experience_tech_user:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/experience_tech?retryWrites=true&w=majority
     ```

6. **Ajouter dans Render**
   - Retournez sur Render > Votre service backend > **"Environment"**
   - Ajoutez la variable :
     - **Key** : `MONGODB_URI`
     - **Value** : Collez votre chaîne de connexion complète
   - Cliquez sur **"Save Changes"**

**✅ C'est tout ! Votre base de données MongoDB est maintenant configurée !**

---

## 🐳 OPTION 2 : Déployer MongoDB sur Render (Private Service)

**⚠️ Plus complexe mais tout reste sur Render**

Vous pouvez déployer MongoDB en tant que "Private Service" sur Render.

### Avantages :
- ✅ Tout reste sur Render
- ✅ Gratuit (plan Free)
- ✅ Contrôle total

### Inconvénients :
- ⚠️ Plus complexe à configurer
- ⚠️ Nécessite un disque persistant (peut nécessiter un plan payant)
- ⚠️ Vous devez gérer les sauvegardes vous-même

### Comment Configurer :

1. **Créer un Private Service**
   - Sur Render Dashboard, cliquez sur **"+ New"** > **"Private Service"**
   - Dans le champ **"Public Git repository"**, entrez :
     ```
     https://github.com/render-examples/mongodb
     ```
   - **Environment** : `Docker`
   - **Name** : `mongodb-service`
   - **Plan** : `Free` (ou `Starter` si vous avez besoin d'un disque persistant)

2. **Configurer le Disque Persistant** (Recommandé)
   - Allez dans **"Advanced"**
   - Cliquez sur **"Add Disk"**
   - Configurez :
     - **Name** : `db`
     - **Mount Path** : `/data/db`
     - **Size** : `10 GB` (ajustez selon vos besoins)
   - **Note** : Les disques persistant peuvent nécessiter un plan payant

3. **Déployer**
   - Cliquez sur **"Create Private Service"**
   - Attendez le déploiement

4. **Récupérer l'URL de Connexion**
   - Une fois déployé, notez l'**Internal URL** (ex: `mongodb-service:27017`)
   - Format de connexion :
     ```
     mongodb://mongodb-service:27017/experience_tech
     ```

5. **Ajouter dans Render**
   - Dans votre service backend > **"Environment"**
   - Ajoutez :
     - **Key** : `MONGODB_URI`
     - **Value** : `mongodb://mongodb-service:27017/experience_tech`
   - Cliquez sur **"Save Changes"**

**📚 Documentation Render :** https://render.com/docs/deploy-mongodb

---

## 🌐 OPTION 3 : Autres Services Gratuits

### Railway (Alternative à Render)
- **MongoDB gratuit** disponible
- Similaire à Render
- Site : https://railway.app

### PlanetScale (MySQL, pas MongoDB)
- Gratuit mais c'est MySQL, pas MongoDB
- Nécessiterait de changer votre code

---

## 💡 RECOMMANDATION

**Je recommande fortement l'OPTION 1 (MongoDB Atlas)** car :
- ✅ C'est le plus simple
- ✅ 100% gratuit
- ✅ Très fiable
- ✅ Gestion automatique
- ✅ Interface graphique pour voir vos données
- ✅ Facile à upgrader plus tard si nécessaire

L'OPTION 2 (Private Service) est possible mais plus complexe et peut nécessiter un plan payant pour le disque persistant.

---

## 📋 Checklist pour MongoDB Atlas (Option 1)

- [ ] Compte MongoDB Atlas créé
- [ ] Cluster M0 FREE créé
- [ ] Accès réseau configuré (Allow from anywhere)
- [ ] Utilisateur de base de données créé
- [ ] Chaîne de connexion récupérée
- [ ] Chaîne de connexion mise à jour avec username, password et database name
- [ ] Variable `MONGODB_URI` ajoutée dans Render
- [ ] Backend redéployé
- [ ] Logs vérifiés (connexion réussie)

---

## 🆘 Besoin d'Aide ?

Si vous choisissez MongoDB Atlas et avez besoin d'aide pour la configuration, dites-moi à quelle étape vous êtes et je vous guiderai ! 🚀

