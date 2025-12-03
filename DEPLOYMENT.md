# Guide de Déploiement - Expérience Tech

## 🚀 Déploiement Frontend (Vercel)

### 1. Préparation
```bash
cd frontend
npm install
npm run build
```

### 2. Configuration Vercel
1. Connectez votre compte GitHub à Vercel
2. Importez le repository
3. Configurez les variables d'environnement :
   - `REACT_APP_API_URL` : URL de votre API backend
   - `REACT_APP_GOOGLE_MAPS_API_KEY` : Clé API Google Maps
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY` : Clé publique Stripe

### 3. Déploiement automatique
- Push sur la branche `main` = déploiement automatique
- Branches de développement = prévisualisation automatique

## 🔧 Déploiement Backend (Heroku)

### 1. Préparation
```bash
cd backend
npm install
```

### 2. Configuration Heroku
```bash
# Installation Heroku CLI
npm install -g heroku

# Login
heroku login

# Création de l'app
heroku create experience-tech-api

# Configuration des variables d'environnement
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb://...
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASS=your_app_password
```

### 3. Déploiement
```bash
git subtree push --prefix=backend heroku main
```

## 🗄️ Base de Données (MongoDB Atlas)

### 1. Configuration
1. Créez un cluster sur MongoDB Atlas
2. Configurez l'accès réseau (0.0.0.0/0 pour production)
3. Créez un utilisateur de base de données
4. Récupérez la chaîne de connexion

### 2. Variables d'environnement
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/experience_tech
```

## 📧 Configuration Email (Gmail SMTP)

### 1. Configuration Gmail
1. Activez l'authentification à 2 facteurs
2. Générez un mot de passe d'application
3. Utilisez ce mot de passe dans `EMAIL_PASS`

### 2. Variables d'environnement
```bash
EMAIL_FROM=noreply@experiencetech.cm
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

## 🗺️ Google Maps API

### 1. Configuration
1. Créez un projet sur Google Cloud Console
2. Activez l'API Maps JavaScript
3. Créez une clé API
4. Configurez les restrictions (domaines autorisés)

### 2. Variables d'environnement
```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 💳 Stripe (Paiements)

### 1. Configuration
1. Créez un compte Stripe
2. Récupérez les clés API (test/production)
3. Configurez les webhooks

### 2. Variables d'environnement
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🔒 Sécurité

### 1. SSL/HTTPS
- Vercel : SSL automatique
- Heroku : SSL automatique
- Nom de domaine personnalisé recommandé

### 2. Variables sensibles
- Jamais de clés dans le code
- Utilisation des variables d'environnement
- Rotation régulière des clés

### 3. CORS
```javascript
// Configuration CORS pour production
const corsOptions = {
  origin: ['https://experiencetech.cm', 'https://www.experiencetech.cm'],
  credentials: true
};
```

## 📊 Monitoring

### 1. Logs
- Vercel : Logs automatiques
- Heroku : `heroku logs --tail`

### 2. Monitoring
- Uptime monitoring (UptimeRobot)
- Performance monitoring (Google Analytics)
- Error tracking (Sentry)

## 🔄 CI/CD

### 1. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐛 Debugging

### 1. Frontend
```bash
# Logs Vercel
vercel logs

# Debug local
npm run start
```

### 2. Backend
```bash
# Logs Heroku
heroku logs --tail

# Debug local
npm run dev
```

## 📈 Performance

### 1. Optimisations
- Compression gzip
- Cache des assets statiques
- Optimisation des images
- Lazy loading

### 2. CDN
- Vercel : CDN automatique
- Images : Cloudinary ou AWS S3

## 🔧 Maintenance

### 1. Mises à jour
- Dépendances : `npm audit fix`
- Base de données : migrations
- Monitoring des performances

### 2. Sauvegarde
- MongoDB Atlas : sauvegardes automatiques
- Code : GitHub
- Variables d'environnement : documentation

## 📞 Support

Pour toute question de déploiement :
- Email : dev@experiencetech.cm
- Documentation : [Lien vers docs]
- Issues : GitHub Issues
