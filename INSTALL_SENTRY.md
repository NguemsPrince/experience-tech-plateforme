# Installation des dépendances Sentry

L'application nécessite les packages Sentry pour le monitoring d'erreurs. Pour les installer :

## Installation

```bash
cd frontend
npm install @sentry/react@^7.91.0 @sentry/tracing@^7.91.0
```

Ou depuis la racine du projet :

```bash
npm install --prefix frontend @sentry/react@^7.91.0 @sentry/tracing@^7.91.0
```

## Alternative : Installation complète des dépendances

Si vous préférez installer toutes les dépendances à jour :

```bash
cd frontend
npm install
```

## Vérification

Après l'installation, redémarrez le serveur de développement :

```bash
cd frontend
npm start
```

L'erreur `Cannot find module '@sentry/react'` devrait disparaître.

## Note

Sentry est optionnel pour le développement. Si vous ne souhaitez pas l'utiliser pour l'instant, vous pouvez commenter l'import dans `frontend/src/index.js` :

```javascript
// import { initSentry } from './config/sentry';
// initSentry();
```

Et dans `frontend/src/App.js`, remplacer `SentryErrorBoundary` par `ErrorBoundary`.

Mais il est recommandé d'installer Sentry pour le monitoring en production.

