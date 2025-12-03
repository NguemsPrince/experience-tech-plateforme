/**
 * Configuration Sentry pour le monitoring d'erreurs
 */

const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

/**
 * Initialiser Sentry
 */
const initSentry = () => {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn || dsn === 'your_sentry_dsn_here') {
    console.log('⚠️  Sentry DSN not configured. Error tracking disabled.');
    return false;
  }

  try {
    Sentry.init({
      dsn: dsn,
      environment: process.env.NODE_ENV || 'development',
      
      // Performance Monitoring
      integrations: [
        nodeProfilingIntegration(),
      ],
      
      // Traces Sample Rate
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Profiling Sample Rate
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Release tracking
      release: process.env.APP_VERSION || '1.0.0',
      
      // Filter des erreurs à envoyer
      beforeSend(event, hint) {
        // Ne pas envoyer les erreurs de validation normales
        if (event.exception) {
          const error = hint.originalException;
          if (error && error.statusCode && error.statusCode < 500) {
            return null; // Ignorer les erreurs client (< 500)
          }
        }
        return event;
      },
      
      // Ignorer certaines erreurs
      ignoreErrors: [
        'ValidationError',
        'UnauthorizedError',
        'ForbiddenError',
        // Ignorer les erreurs réseau client
        'NetworkError',
        'TimeoutError',
      ],
    });

    console.log('✅ Sentry initialized');
    return true;
  } catch (error) {
    console.error('❌ Sentry initialization error:', error);
    return false;
  }
};

/**
 * Middleware Express pour Sentry
 */
const sentryMiddleware = {
  requestHandler: Sentry.Handlers.requestHandler(),
  tracingHandler: Sentry.Handlers.tracingHandler(),
  errorHandler: Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Ne capturer que les erreurs serveur (500+)
      return error.statusCode >= 500 || !error.statusCode;
    }
  })
};

/**
 * Capturer une exception manuellement
 */
const captureException = (error, context = {}) => {
  if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your_sentry_dsn_here') {
    Sentry.withScope((scope) => {
      // Ajouter du contexte
      Object.keys(context).forEach(key => {
        scope.setContext(key, context[key]);
      });
      
      Sentry.captureException(error);
    });
  }
};

/**
 * Capturer un message
 */
const captureMessage = (message, level = 'info', context = {}) => {
  if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your_sentry_dsn_here') {
    Sentry.withScope((scope) => {
      Object.keys(context).forEach(key => {
        scope.setContext(key, context[key]);
      });
      
      Sentry.captureMessage(message, level);
    });
  }
};

/**
 * Ajouter du contexte utilisateur
 */
const setUser = (user) => {
  if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your_sentry_dsn_here') {
    Sentry.setUser({
      id: user.id || user._id?.toString(),
      email: user.email,
      role: user.role,
      username: user.firstName || user.name
    });
  }
};

/**
 * Ajouter du contexte à la transaction actuelle
 */
const setContext = (name, context) => {
  if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your_sentry_dsn_here') {
    Sentry.setContext(name, context);
  }
};

module.exports = {
  initSentry,
  sentryMiddleware,
  captureException,
  captureMessage,
  setUser,
  setContext,
  Sentry
};

