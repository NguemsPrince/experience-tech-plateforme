# 🚀 MongoDB Atlas - Guide Rapide (5 minutes)

## ⚡ Configuration Express en 5 Étapes

### ÉTAPE 1 : Créer un Compte (1 minute)

1. Allez sur **https://www.mongodb.com/atlas**
2. Cliquez sur **"Try Free"** (en haut à droite)
3. Remplissez le formulaire :
   - Email
   - Mot de passe
   - Nom et prénom
4. Cliquez sur **"Get started free"**

---

### ÉTAPE 2 : Créer un Cluster (2 minutes)

1. Une fois connecté, cliquez sur **"Build a Database"**
2. Choisissez **"M0 FREE"** (le plan gratuit en haut)
3. Sélectionnez une région (choisissez la plus proche de vos utilisateurs)
4. Cliquez sur **"Create"**
5. ⏳ Attendez 3-5 minutes que le cluster soit créé

---

### ÉTAPE 3 : Configurer l'Accès (1 minute)

1. Dans le menu de gauche, cliquez sur **"Network Access"**
2. Cliquez sur **"Add IP Address"**
3. Cliquez sur **"Allow Access from Anywhere"** (bouton vert)
4. Cliquez sur **"Confirm"**

---

### ÉTAPE 4 : Créer un Utilisateur (1 minute)

1. Dans le menu de gauche, cliquez sur **"Database Access"**
2. Cliquez sur **"Add New Database User"**
3. Choisissez **"Password"**
4. Entrez :
   - **Username** : `experience_tech_user`
   - **Password** : Générez un mot de passe fort - **NOTEZ-LE !**
5. Donnez les permissions **"Read and write to any database"**
6. Cliquez sur **"Add User"**

---

### ÉTAPE 5 : Récupérer la Chaîne de Connexion (1 minute)

1. Dans le menu de gauche, cliquez sur **"Database"**
2. Cliquez sur le bouton **"Connect"** sur votre cluster
3. Choisissez **"Connect your application"**
4. Copiez la chaîne de connexion
5. **Modifiez-la** :
   - Remplacez `<username>` par `experience_tech_user`
   - Remplacez `<password>` par votre mot de passe
   - Ajoutez `/experience_tech` avant le `?`
   
   **Exemple final :**
   ```
   mongodb+srv://experience_tech_user:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/experience_tech?retryWrites=true&w=majority
   ```

---

## ✅ Ajouter dans Render

1. Retournez sur **Render Dashboard**
2. Allez sur votre service backend
3. Cliquez sur l'onglet **"Environment"**
4. Cliquez sur **"+ Add Environment Variable"**
5. Ajoutez :
   - **Key** : `MONGODB_URI`
   - **Value** : Collez votre chaîne de connexion complète
6. Cliquez sur **"Save Changes"**

---

## 🎉 C'est Tout !

Votre base de données MongoDB est maintenant configurée et **100% gratuite** !

Render va redéployer automatiquement votre backend et se connecter à MongoDB.

---

## ✅ Vérification

1. Allez dans les **Logs** de votre backend sur Render
2. Vous devriez voir :
   ```
   MongoDB Connected: cluster0.xxxxx.mongodb.net
   🚀 Server running in production mode
   ```

3. Testez l'endpoint :
   ```
   https://votre-backend.onrender.com/api/health
   ```
   Vous devriez voir : `"mongodb": "connected"`

---

## 🆘 Besoin d'Aide ?

Si vous êtes bloqué à une étape, dites-moi laquelle et je vous guiderai ! 🚀

