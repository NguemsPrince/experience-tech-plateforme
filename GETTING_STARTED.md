# Guide de Démarrage - Expérience Tech

## 🚀 Installation Rapide

### Prérequis
- Node.js 16+ et npm
- MongoDB (local ou Atlas)
- Git

### 1. Cloner le Repository
```bash
git clone https://github.com/your-username/experience-tech-platform.git
cd experience-tech-platform
```

### 2. Installation des Dépendances
```bash
# Installation de toutes les dépendances
npm run install-all

# Ou manuellement :
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 3. Configuration des Variables d'Environnement
```bash
# Copier le fichier d'exemple
cp backend/.env.example backend/.env

# Éditer les variables selon votre configuration
nano backend/.env
```

### 4. Démarrage en Mode Développement
```bash
# Démarrer frontend et backend simultanément
npm run dev

# Ou séparément :
npm run server  # Backend sur http://localhost:5000
npm run client  # Frontend sur http://localhost:3000
```

## ⚙️ Configuration Détaillée

### Variables d'Environnement Backend

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/experience_tech

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRE=30d

# Email (optionnel)
EMAIL_FROM=noreply@experiencetech.cm
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Security
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

### Configuration Frontend

Le frontend est configuré pour se connecter automatiquement au backend via le proxy configuré dans `package.json`.

## 🗄️ Base de Données

### MongoDB Local
```bash
# Installation MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Démarrer MongoDB
sudo systemctl start mongodb

# Vérifier le statut
sudo systemctl status mongodb
```

### MongoDB Atlas (Cloud)
1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un nouveau cluster
3. Configurez l'accès réseau (0.0.0.0/0 pour le développement)
4. Créez un utilisateur de base de données
5. Récupérez la chaîne de connexion
6. Remplacez `MONGODB_URI` dans `.env`

## 🌐 Fonctionnalités Principales

### Pages Disponibles
- **/** - Page d'accueil avec slider et présentation
- **/about** - À propos de l'entreprise
- **/services** - Catalogue des services
- **/products** - Produits et réalisations
- **/news** - Actualités et blog
- **/training** - Formations et certifications
- **/forum** - Forum communautaire
- **/careers** - Offres d'emploi
- **/contact** - Formulaire de contact
- **/login** - Connexion utilisateur
- **/register** - Inscription utilisateur
- **/client** - Espace client (protégé)

### Services API
- **Authentication** - Inscription, connexion, gestion profil
- **Services** - Catalogue des services, demandes de devis
- **Contact** - Envoi de messages, informations de contact
- **News** - Articles et actualités
- **Training** - Formations et cours
- **Forum** - Catégories et discussions
- **Careers** - Offres d'emploi

## 🎨 Personnalisation

### Thème et Couleurs
Modifiez `frontend/tailwind.config.js` pour personnaliser :
- Couleurs principales
- Typographie
- Espacements
- Animations

### Traductions
Ajoutez vos traductions dans :
- `frontend/src/locales/fr.json` (Français)
- `frontend/src/locales/en.json` (Anglais)
- `frontend/src/locales/ar.json` (Arabe)

### Contenu
- Remplacez les images placeholder par vos propres images
- Modifiez le contenu des pages selon vos besoins
- Personnalisez les services et produits

## 🔧 Scripts Disponibles

### Scripts Principaux
```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm start            # Démarrage de production
npm run install-all  # Installation de toutes les dépendances
```

### Scripts Frontend
```bash
cd frontend
npm start            # Démarrage du serveur de développement
npm run build        # Build pour production
npm test             # Tests
npm run eject        # Éjection de Create React App
```

### Scripts Backend
```bash
cd backend
npm start            # Démarrage du serveur
npm run dev          # Démarrage avec nodemon
npm test             # Tests
```

## 🐛 Résolution des Problèmes

### Problèmes Courants

#### Port déjà utilisé
```bash
# Tuer le processus utilisant le port 3000
lsof -ti:3000 | xargs kill -9

# Ou changer le port dans package.json
"start": "PORT=3001 react-scripts start"
```

#### Erreurs MongoDB
```bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongodb

# Redémarrer MongoDB
sudo systemctl restart mongodb
```

#### Erreurs de dépendances
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### Erreurs CORS
Vérifiez la configuration CORS dans `backend/server.js` :
```javascript
const corsOptions = {
  origin: 'http://localhost:3000', // URL de votre frontend
  credentials: true
};
```

### Logs et Debug

#### Frontend
- Ouvrez les DevTools du navigateur
- Onglet Console pour les erreurs JavaScript
- Onglet Network pour les requêtes API

#### Backend
- Logs dans le terminal
- Utilisez `console.log()` pour le debug
- Middleware de logging avec Morgan

## 📚 Ressources Utiles

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Outils de Développement
- [Postman](https://www.postman.com) - Test des API
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI MongoDB
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools) - Extension Chrome

## 🤝 Contribution

### Workflow Git
```bash
# Créer une branche pour votre fonctionnalité
git checkout -b feature/nouvelle-fonctionnalite

# Faire vos modifications
git add .
git commit -m "Ajout nouvelle fonctionnalité"

# Pousser vers GitHub
git push origin feature/nouvelle-fonctionnalite

# Créer une Pull Request sur GitHub
```

### Standards de Code
- Utilisez Prettier pour le formatage
- Suivez les règles ESLint
- Écrivez des tests pour les nouvelles fonctionnalités
- Documentez votre code

## 📞 Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Consultez la documentation
- Contactez l'équipe de développement

## 🎉 Prochaines Étapes

Une fois l'installation terminée :
1. Explorez les différentes pages
2. Testez les fonctionnalités d'authentification
3. Personnalisez le contenu selon vos besoins
4. Configurez les intégrations (email, paiements)
5. Déployez en production

Bon développement ! 🚀
