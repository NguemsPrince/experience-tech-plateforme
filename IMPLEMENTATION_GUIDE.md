# 📚 Guide d'implémentation - Améliorations prioritaires

Ce document décrit comment utiliser et configurer les améliorations récemment implémentées.

## ✅ 1. Tests unitaires (Backend/Frontend)

### Backend

Les tests sont configurés avec Jest et Supertest.

**Structure :**
```
backend/
├── jest.config.js          # Configuration Jest
├── tests/
│   ├── setup.js            # Setup global des tests
│   ├── helpers/
│   │   └── testHelpers.js  # Helpers réutilisables
│   ├── unit/
│   │   ├── models/         # Tests des modèles MongoDB
│   │   └── middleware/     # Tests des middlewares
│   └── integration/
│       └── auth.test.js    # Tests d'intégration API
```

**Commandes :**
```bash
cd backend
npm test                    # Lancer tous les tests
npm test -- --coverage      # Avec coverage
npm test -- auth.test.js    # Test spécifique
```

**Variables d'environnement pour tests :**
- `MONGODB_TEST_URI` : URI de la base de données de test
- `NODE_ENV=test` : Automatiquement défini par Jest

### Frontend

Les tests sont configurés avec Jest et React Testing Library.

**Structure :**
```
frontend/src/
├── __tests__/
│   ├── components/         # Tests des composants
│   └── services/           # Tests des services
└── setupTests.js           # Configuration globale
```

**Commandes :**
```bash
cd frontend
npm test                    # Mode watch
npm run test:coverage       # Avec coverage
npm run test:all            # Tests + E2E
```

---

## ✅ 2. Cache Redis

### Configuration

1. **Installer Redis** (si pas déjà fait) :
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
```

2. **Variables d'environnement** :
```env
REDIS_URL=redis://localhost:6379
```

### Utilisation

**Service de cache** (`backend/config/redis.js`) :
```javascript
const { cacheService } = require('./config/redis');

// Obtenir une valeur
const cached = await cacheService.get('key');

// Définir une valeur (TTL en secondes)
await cacheService.set('key', { data: 'value' }, 3600);

// Supprimer une clé
await cacheService.del('key');

// Supprimer par pattern
await cacheService.delPattern('cache:*');
```

**Middleware de cache** (`backend/middleware/cache.js`) :
```javascript
const { cacheMiddleware } = require('../middleware/cache');

// Appliquer cache à une route (TTL de 1 heure)
router.get('/training', cacheMiddleware(3600), async (req, res) => {
  // Route avec cache automatique
});

// Avec générateur de clé personnalisé
router.get('/training/:id', cacheMiddleware(1800, (req) => {
  return `training:detail:${req.params.id}`;
}), async (req, res) => {
  // Route avec clé de cache personnalisée
});
```

**Invalidation du cache** :
```javascript
const { invalidateRouteCache, invalidateUserCache } = require('../middleware/cache');

// Après modification d'une formation
await invalidateRouteCache('/api/training');

// Après modification d'un utilisateur
await invalidateUserCache(userId);
```

### Routes avec cache

Actuellement en cache :
- `GET /api/training` (1 heure)
- `GET /api/training/:courseId` (30 minutes)

---

## ✅ 3. Monitoring Sentry

### Backend

**Configuration** (`backend/config/sentry.js`) :
1. Créer un projet sur [sentry.io](https://sentry.io)
2. Récupérer votre DSN
3. Ajouter dans `.env` :
```env
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

**Utilisation manuelle** :
```javascript
const { captureException, setUser } = require('./config/sentry');

try {
  // Code qui peut échouer
} catch (error) {
  captureException(error, {
    context: { additional: 'info' }
  });
}

// Ajouter contexte utilisateur
setUser({
  id: user._id,
  email: user.email,
  role: user.role
});
```

**Middleware intégré** :
- Les erreurs serveur (500+) sont automatiquement capturées
- Le contexte de la requête est automatiquement ajouté
- L'utilisateur est automatiquement ajouté si `req.user` existe

### Frontend

**Configuration** (`frontend/src/config/sentry.js`) :

1. Créer un fichier `.env.local` dans `frontend/` :
```env
REACT_APP_SENTRY_DSN=https://your-dsn@sentry.io/project-id
REACT_APP_VERSION=1.0.0
```

2. Initialiser dans `frontend/src/index.js` :
```javascript
import { initSentry } from './config/sentry';

// Avant ReactDOM.render()
initSentry();

ReactDOM.render(<App />, document.getElementById('root'));
```

3. Utiliser Error Boundary :
```javascript
import { SentryErrorBoundary } from './config/sentry';

function App() {
  return (
    <SentryErrorBoundary fallback={<ErrorFallback />}>
      {/* Votre application */}
    </SentryErrorBoundary>
  );
}
```

**Utilisation manuelle** :
```javascript
import { captureException, setUser } from './config/sentry';

try {
  // Code qui peut échouer
} catch (error) {
  captureException(error, {
    component: 'PaymentModal',
    props: { amount, currency }
  });
}

// Ajouter contexte utilisateur
setUser({
  id: user._id,
  email: user.email,
  role: user.role
});
```

---

## ✅ 4. Documentation API Swagger

### Accès

Une fois le serveur démarré :
```
http://localhost:5000/api-docs
```

### Documentation des routes

Utiliser les annotations JSDoc dans les fichiers de routes :

```javascript
/**
 * @swagger
 * /training:
 *   get:
 *     summary: Récupérer toutes les formations
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des formations
 */
router.get('/training', async (req, res) => {
  // ...
});
```

### Schémas personnalisés

Les schémas sont définis dans `backend/config/swagger.js`. Pour ajouter un nouveau schéma :

```javascript
components: {
  schemas: {
    NewSchema: {
      type: 'object',
      properties: {
        field: { type: 'string' }
      }
    }
  }
}
```

### Authentification dans Swagger

1. Cliquer sur le bouton "Authorize" en haut
2. Entrer votre token JWT : `Bearer <your-token>`
3. Les requêtes incluront automatiquement l'en-tête `Authorization`

---

## 📋 Checklist de déploiement

### Tests
- [ ] Backend : `npm test` passe tous les tests
- [ ] Frontend : `npm run test:coverage` atteint 70%+ coverage
- [ ] Tests d'intégration : `npm test -- auth.test.js` fonctionne

### Redis
- [ ] Redis est installé et fonctionne : `redis-cli ping` → `PONG`
- [ ] Variable `REDIS_URL` configurée dans `.env`
- [ ] Le cache fonctionne : vérifier les logs backend

### Sentry
- [ ] Projet Sentry créé pour backend
- [ ] Projet Sentry créé pour frontend
- [ ] Variables `SENTRY_DSN` configurées dans `.env` (backend) et `.env.local` (frontend)
- [ ] Tester en générant une erreur (500+) et vérifier dans Sentry

### Swagger
- [ ] Accéder à `http://localhost:5000/api-docs`
- [ ] Documentation complète et lisible
- [ ] Tester une route avec authentification

---

## 🔧 Dépannage

### Redis non disponible
- Le système continue de fonctionner sans cache
- Les logs afficheront : `Redis not available, running without cache`
- Vérifier que Redis est démarré : `redis-cli ping`

### Sentry ne capture pas d'erreurs
- Vérifier que `SENTRY_DSN` est correctement configuré
- Vérifier que seules les erreurs 500+ sont capturées (comportement normal)
- Consulter les logs : `✅ Sentry initialized` ou `⚠️  Sentry DSN not configured`

### Swagger ne s'affiche pas
- Vérifier que le serveur backend est démarré
- Vérifier l'URL : `http://localhost:5000/api-docs` (pas `/api/api-docs`)
- Consulter les logs pour erreurs de compilation Swagger

### Tests échouent
- Vérifier que MongoDB est démarré pour les tests d'intégration
- Vérifier `MONGODB_TEST_URI` dans `.env`
- Nettoyer la base de test : `mongo experience_tech_test --eval "db.dropDatabase()"`

---

## 📊 Métriques de succès

- **Tests** : Coverage > 70% (backend et frontend)
- **Cache** : Réduction du temps de réponse de 50%+ pour les routes en cache
- **Sentry** : Toutes les erreurs serveur (500+) sont capturées
- **Swagger** : 100% des routes publiques documentées

---

## 🔄 Prochaines étapes

1. Ajouter plus de tests unitaires (services, utils)
2. Implémenter cache sur toutes les routes GET publiques
3. Configurer alertes Sentry pour erreurs critiques
4. Documenter toutes les routes dans Swagger
5. Ajouter exemples de requêtes/réponses dans Swagger

---

**Date de création** : 2024
**Dernière mise à jour** : 2024

