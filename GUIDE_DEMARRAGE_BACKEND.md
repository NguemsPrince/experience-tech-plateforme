# 🚀 Guide de Démarrage du Backend - Expérience Tech

## Problème: "La connexion a échoué - Firefox ne peut établir de connexion avec le serveur à l'adresse localhost:5000"

Ce problème se produit lorsque le serveur backend n'est pas démarré ou que MongoDB n'est pas en cours d'exécution.

## ✅ Solution Rapide

### Option 1: Script de Démarrage Complet (Recommandé)

Utilisez le script `demarrer-backend-complet.sh` qui démarre automatiquement MongoDB et le backend:

```bash
cd /Users/nguemsprince/Desktop/Projet
./demarrer-backend-complet.sh
```

Ce script:
- ✅ Vérifie si MongoDB est en cours d'exécution
- ✅ Démarre MongoDB si nécessaire
- ✅ Vérifie si le port 5000 est disponible
- ✅ Démarre le backend
- ✅ Vérifie que le backend répond correctement

### Option 2: Script de Démarrage Simple

Utilisez le script `start-backend.sh` qui démarre MongoDB et le backend:

```bash
cd /Users/nguemsprince/Desktop/Projet
./start-backend.sh
```

### Option 3: Démarrage Manuel

#### Étape 1: Démarrer MongoDB

```bash
cd /Users/nguemsprince/Desktop/Projet

# Démarrer MongoDB
./mongodb-macos-x86_64-7.0.5/bin/mongod \
    --dbpath ./mongodb-data \
    --port 27017 \
    --logpath ./mongodb.log \
    --fork
```

#### Étape 2: Vérifier que MongoDB est en cours d'exécution

```bash
# Vérifier le port 27017
lsof -i :27017

# Ou vérifier les processus MongoDB
ps aux | grep mongod
```

#### Étape 3: Démarrer le Backend

```bash
cd /Users/nguemsprince/Desktop/Projet/backend

# Utiliser Node.js local
export PATH="/Users/nguemsprince/Desktop/Projet/node-v18.19.0-darwin-x64/bin:$PATH"

# Démarrer le serveur
node server.js
```

#### Étape 4: Vérifier que le Backend fonctionne

Ouvrez votre navigateur et allez à:
- **Health Check**: http://localhost:5000/api/health
- **API Root**: http://localhost:5000/

Vous devriez voir une réponse JSON indiquant que le serveur fonctionne.

## 🔍 Vérification des Services

### Vérifier MongoDB

```bash
# Vérifier si MongoDB est en cours d'exécution
lsof -i :27017

# Vérifier les logs MongoDB
tail -f /Users/nguemsprince/Desktop/Projet/mongodb.log
```

### Vérifier le Backend

```bash
# Vérifier si le backend est en cours d'exécution
lsof -i :5000

# Vérifier les logs du backend
tail -f /Users/nguemsprince/Desktop/Projet/backend.log

# Tester le health check
curl http://localhost:5000/api/health
```

## 🛑 Arrêter les Services

### Arrêter MongoDB

```bash
# Trouver le processus MongoDB
ps aux | grep mongod

# Arrêter MongoDB
pkill -f mongod

# Ou arrêter MongoDB proprement
./mongodb-macos-x86_64-7.0.5/bin/mongosh --eval "db.adminCommand({shutdown:1})"
```

### Arrêter le Backend

```bash
# Trouver le processus backend
lsof -i :5000

# Arrêter le backend
lsof -ti:5000 | xargs kill -9
```

### Arrêter Tous les Services

```bash
# Arrêter MongoDB et le backend
pkill -f mongod
lsof -ti:5000 | xargs kill -9
```

## 🐛 Résolution des Problèmes

### Problème 1: MongoDB ne démarre pas

**Symptômes:**
- Erreur: "Address already in use"
- Erreur: "Permission denied"
- Erreur: "Data directory not found"

**Solutions:**
```bash
# Libérer le port 27017
lsof -ti:27017 | xargs kill -9

# Vérifier les permissions du répertoire de données
ls -la /Users/nguemsprince/Desktop/Projet/mongodb-data

# Créer le répertoire de données s'il n'existe pas
mkdir -p /Users/nguemsprince/Desktop/Projet/mongodb-data
```

### Problème 2: Le Backend ne démarre pas

**Symptômes:**
- Erreur: "Cannot connect to MongoDB"
- Erreur: "Port 5000 already in use"
- Erreur: "Module not found"

**Solutions:**
```bash
# Vérifier que MongoDB est en cours d'exécution
lsof -i :27017

# Libérer le port 5000
lsof -ti:5000 | xargs kill -9

# Vérifier les dépendances
cd /Users/nguemsprince/Desktop/Projet/backend
npm install
```

### Problème 3: Le Backend démarre mais ne répond pas

**Symptômes:**
- Le backend démarre mais les requêtes échouent
- Erreur: "Connection refused"
- Erreur: "Network error"

**Solutions:**
```bash
# Vérifier les logs du backend
tail -f /Users/nguemsprince/Desktop/Projet/backend.log

# Vérifier la configuration MongoDB
cat /Users/nguemsprince/Desktop/Projet/backend/.env | grep MONGODB_URI

# Tester la connexion MongoDB
./mongodb-macos-x86_64-7.0.5/bin/mongosh
```

## 📋 Configuration Requise

### Variables d'Environnement

Le fichier `.env` dans le dossier `backend` doit contenir:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/experience_tech
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

### Répertoires Requis

- `mongodb-data/` - Répertoire de données MongoDB
- `backend/` - Répertoire du backend
- `backend/.env` - Fichier de configuration

## 🔗 URLs Utiles

- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health
- **API Auth**: http://localhost:5000/api/auth
- **MongoDB**: mongodb://localhost:27017

## 📞 Support

Si vous rencontrez toujours des problèmes:

1. Vérifiez les logs dans `mongodb.log` et `backend.log`
2. Vérifiez que tous les ports sont libres
3. Vérifiez que MongoDB et Node.js sont correctement installés
4. Vérifiez la configuration dans le fichier `.env`

## 🎯 Commandes Rapides

```bash
# Démarrer tout (MongoDB + Backend)
./demarrer-backend-complet.sh

# Démarrer seulement le backend (avec vérification MongoDB)
./start-backend.sh

# Vérifier les services
lsof -i :27017 && lsof -i :5000

# Arrêter tout
pkill -f mongod && lsof -ti:5000 | xargs kill -9
```

