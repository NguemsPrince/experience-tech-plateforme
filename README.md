# Plateforme Web Expérience Tech

## 🚀 Description
Plateforme web dynamique complète pour la société Expérience Tech, spécialisée dans les services numériques, formations, impression, commerce et réseaux.

## 🎉 Dernières Améliorations (31/10/2025)

### ✨ Nouvelles Fonctionnalités
- ✅ **Navigation améliorée** : Menus actifs clairement mis en évidence avec transitions fluides
- ✅ **Paiement par carte prépayée** : Nouveau système de paiement avec codes uniques
- ✅ **Expérience utilisateur enrichie** : Affichage détaillé des formations et historique des paiements

👉 **Voir toutes les améliorations** : `README_AMELIORATIONS.md`

## 🛠 Technologies Utilisées

### Frontend
- **React.js** - Framework principal
- **Tailwind CSS** - Framework CSS
- **React Router** - Navigation
- **i18next** - Multilingue (Français, Anglais, Arabe)
- **Axios** - Appels API
- **React Slick** - Sliders
- **React Countup** - Compteurs animés
- **React Photo Gallery** - Galerie photos
- **React Player** - Lecteur vidéo
- **React Google Maps** - Cartes
- **React Chatbot Kit** - Chatbot

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification
- **Bcryptjs** - Hachage mots de passe
- **Multer** - Upload fichiers
- **Nodemailer** - Envoi emails
- **Helmet** - Sécurité
- **Express Rate Limit** - Limitation requêtes

## 📁 Structure du Projet

```
experience-tech-platform/
├── frontend/                 # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── services/       # Services API
│   │   ├── utils/          # Utilitaires
│   │   ├── locales/        # Traductions
│   │   ├── styles/         # Styles globaux
│   │   └── App.js          # Composant principal
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # API Node.js
│   ├── controllers/        # Contrôleurs
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes API
│   ├── middleware/        # Middlewares
│   ├── utils/             # Utilitaires
│   ├── config/            # Configuration
│   └── server.js          # Serveur principal
├── package.json
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** >= 18.x (disponible dans le projet : `node-v18.19.0-darwin-x64`)
- **MongoDB** (local ou distant)
- **npm** ou **yarn**

### 1. Configuration des variables d'environnement
```bash
# Initialiser les fichiers .env automatiquement
./init-env.sh

# Ou manuellement :
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
```

**Important** : Modifiez les fichiers `.env` avec vos configurations :
- `backend/.env` : MongoDB URI, JWT_SECRET, etc.
- `frontend/.env` : REACT_APP_API_URL, clés Stripe, etc.

### 2. Installation des dépendances
```bash
# Installer toutes les dépendances (racine, frontend, backend)
npm run install-all

# Ou manuellement :
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 3. Démarrage en mode développement
```bash
# Démarrer le serveur backend et frontend simultanément
npm run dev

# Ou séparément :
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 4. Accès à l'application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### 5. Vérification de l'installation
```bash
# Vérifier que MongoDB est accessible
# Vérifier que le backend démarre correctement
# Vérifier que le frontend compile sans erreurs
```

## 🌍 Fonctionnalités

### Pages Principales
- ✅ **Accueil** - Présentation, slider, chiffres clés
- ✅ **À propos** - Historique, vision, mission, organigramme
- ✅ **Services** - Catalogue avec devis
- ✅ **Produits & Réalisations** - Galerie, études de cas
- ✅ **Actualités & Blog** - Articles, commentaires
- ✅ **Espace Formation** - Catalogue, inscriptions
- ✅ **Espace Client** - Tableau de bord, factures
- ✅ **Carrières** - Offres d'emploi
- ✅ **Forum** - Communauté, Q&A
- ✅ **Contact** - Formulaire, carte

### Fonctionnalités Techniques
- 🌐 **Multilingue** - Français, Anglais, Arabe
- 📱 **Responsive Design** - PC, tablette, mobile
- 🔐 **Sécurité** - SSL, authentification JWT
- 🔍 **SEO** - Méta tags, sitemap
- 📧 **Notifications** - Email, intégrations
- 🤖 **Chatbot** - Assistant automatique

## 🚀 Déploiement

### Vercel (Frontend)
```bash
cd frontend
npm run build
# Déployer le dossier build/
```

### Heroku (Backend)
```bash
# Configurer les variables d'environnement sur Heroku
# Déployer le dossier backend/
```

## 📞 Support
Pour toute question ou support technique, contactez l'équipe Expérience Tech.

---
**Expérience Tech** - Votre partenaire numérique de confiance
