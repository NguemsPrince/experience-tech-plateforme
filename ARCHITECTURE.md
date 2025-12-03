# Architecture de la Plateforme Expérience Tech

## 🏗️ Vue d'ensemble

La plateforme Expérience Tech est une application web moderne construite avec une architecture full-stack séparée en frontend et backend, offrant des services numériques, formations, impression, commerce et solutions réseaux.

## 📋 Stack Technologique

### Frontend
- **React.js 18** - Framework principal
- **React Router** - Navigation côté client
- **Tailwind CSS** - Framework CSS utility-first
- **i18next** - Internationalisation (Français, Anglais, Arabe)
- **React Hook Form** - Gestion des formulaires
- **Axios** - Client HTTP
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **React Helmet Async** - Gestion du SEO

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **Bcryptjs** - Hachage des mots de passe
- **Express Validator** - Validation des données
- **Helmet** - Sécurité HTTP
- **CORS** - Gestion des requêtes cross-origin

### Outils de Développement
- **Concurrently** - Exécution parallèle des scripts
- **Nodemon** - Rechargement automatique
- **ESLint** - Linting du code
- **Prettier** - Formatage du code

## 🏛️ Architecture Frontend

### Structure des Dossiers
```
frontend/
├── public/                 # Fichiers statiques
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Header.js      # Navigation principale
│   │   ├── Footer.js      # Pied de page
│   │   ├── LanguageSelector.js # Sélecteur de langue
│   │   └── ...
│   ├── pages/            # Pages de l'application
│   │   ├── Home.js       # Page d'accueil
│   │   ├── About.js      # À propos
│   │   ├── Services.js   # Services
│   │   └── ...
│   ├── services/         # Services API
│   │   ├── api.js        # Configuration Axios
│   │   ├── auth.js       # Service d'authentification
│   │   └── ...
│   ├── utils/            # Utilitaires
│   │   └── i18n.js       # Configuration i18next
│   ├── locales/          # Fichiers de traduction
│   │   ├── fr.json       # Français
│   │   ├── en.json       # Anglais
│   │   └── ar.json       # Arabe
│   ├── styles/           # Styles globaux
│   ├── App.js            # Composant principal
│   └── index.js          # Point d'entrée
├── tailwind.config.js    # Configuration Tailwind
└── package.json
```

### Composants Principaux

#### Header
- Navigation responsive
- Sélecteur de langue
- Authentification utilisateur
- Menu mobile

#### Pages
- **Home** : Page d'accueil avec slider, services, témoignages
- **About** : Histoire, vision, mission, équipe
- **Services** : Catalogue des services avec devis
- **Products** : Réalisations et projets
- **News** : Blog et actualités
- **Training** : Formations et certifications
- **Forum** : Communauté et discussions
- **Careers** : Offres d'emploi
- **Contact** : Formulaire de contact
- **Client** : Espace client protégé

### Fonctionnalités Frontend

#### Internationalisation
- Support 3 langues (FR, EN, AR)
- Détection automatique de la langue
- Support RTL pour l'arabe
- Traductions stockées en JSON

#### Responsive Design
- Mobile-first approach
- Breakpoints Tailwind CSS
- Navigation adaptative
- Images responsive

#### SEO
- Meta tags dynamiques
- Structured data JSON-LD
- Open Graph tags
- Sitemap XML

## 🏗️ Architecture Backend

### Structure des Dossiers
```
backend/
├── config/               # Configuration
│   └── database.js       # Connexion MongoDB
├── controllers/          # Contrôleurs (logique métier)
├── middleware/           # Middlewares
│   ├── auth.js          # Authentification JWT
│   ├── errorHandler.js  # Gestion d'erreurs
│   └── notFound.js      # Route 404
├── models/              # Modèles MongoDB
│   └── User.js          # Modèle utilisateur
├── routes/              # Routes API
│   ├── auth.js          # Authentification
│   ├── services.js      # Services
│   ├── contact.js       # Contact
│   └── ...
├── utils/               # Utilitaires
│   └── response.js      # Formatage des réponses
├── server.js            # Serveur principal
└── package.json
```

### API Endpoints

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/updatedetails` - Mise à jour profil
- `PUT /api/auth/updatepassword` - Changement mot de passe

#### Services
- `GET /api/services` - Liste des services
- `GET /api/services/:id` - Détail service
- `POST /api/services/:id/quote` - Demande de devis

#### Contact
- `POST /api/contact` - Envoi message
- `GET /api/contact/info` - Informations contact

### Sécurité

#### Authentification
- JWT tokens avec expiration
- Refresh tokens
- Cookies sécurisés
- Hachage bcrypt des mots de passe

#### Validation
- Express Validator
- Sanitisation des données
- Validation des entrées utilisateur

#### Protection
- Helmet.js (headers sécurisés)
- CORS configuré
- Rate limiting
- Protection contre XSS et injection

## 🗄️ Base de Données

### MongoDB Collections

#### Users
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (client|student|admin),
  avatar: String,
  isEmailVerified: Boolean,
  preferences: {
    language: String,
    notifications: Object
  },
  address: Object,
  company: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- Email (unique)
- Role
- isActive
- createdAt

## 🌐 Fonctionnalités Multilingues

### Configuration i18next
- Détection automatique de la langue
- Fallback vers le français
- Support RTL pour l'arabe
- Persistance dans localStorage

### Traductions
- Structure JSON hiérarchique
- Interpolation des variables
- Pluralisation
- Namespaces pour l'organisation

## 📱 Responsive Design

### Breakpoints Tailwind
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Approche Mobile-First
- Design mobile en premier
- Progressive enhancement
- Touch-friendly interfaces
- Performance optimisée

## 🔒 Sécurité

### Frontend
- Validation des formulaires
- Sanitisation des entrées
- HTTPS obligatoire
- CSP headers

### Backend
- JWT authentification
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection

## 📊 Performance

### Frontend
- Lazy loading des composants
- Code splitting
- Optimisation des images
- Compression gzip

### Backend
- Compression middleware
- Caching des réponses
- Optimisation des requêtes MongoDB
- Connection pooling

## 🚀 Déploiement

### Frontend (Vercel)
- Déploiement automatique
- CDN global
- SSL automatique
- Preview deployments

### Backend (Heroku)
- Git-based deployment
- Auto-scaling
- Logs centralisés
- Add-ons disponibles

### Base de Données (MongoDB Atlas)
- Cloud-hosted
- Sauvegardes automatiques
- Monitoring intégré
- Scaling horizontal

## 🔄 CI/CD

### GitHub Actions
- Tests automatiques
- Linting
- Build verification
- Déploiement automatique

### Quality Gates
- Code coverage > 80%
- Pas d'erreurs ESLint
- Tests unitaires passants
- Performance budgets

## 📈 Monitoring

### Frontend
- Google Analytics
- Error tracking (Sentry)
- Performance monitoring
- User behavior analytics

### Backend
- Application logs
- Error tracking
- Performance metrics
- Database monitoring

## 🔧 Maintenance

### Mises à jour
- Dépendances NPM
- Sécurité patches
- Feature updates
- Bug fixes

### Monitoring
- Uptime monitoring
- Performance tracking
- Error alerting
- Capacity planning

Cette architecture garantit une application scalable, sécurisée et performante, capable de gérer la croissance de l'entreprise Expérience Tech tout en offrant une excellente expérience utilisateur.
