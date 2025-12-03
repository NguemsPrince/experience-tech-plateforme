/**
 * Configuration Sentry pour le frontend React
 * 
 * NOTE: Décommenter les imports ci-dessous après installation des packages :
 * npm install @sentry/react @sentry/tracing
 */

// TODO: Décommenter après installation de Sentry
// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/tracing";

// Mocks temporaires pour éviter les erreurs
const Sentry = {
  init: () => { console.log('⚠️  Sentry not installed. Install with: npm install @sentry/react @sentry/tracing'); return false; },
  captureException: () => {},
  captureMessage: () => {},
  setUser: () => {},
  setContext: () => {},
  withScope: (fn) => fn && fn({ setContext: () => {}, setUser: () => {} }),
  ErrorBoundary: ({ children }) => children
};
const BrowserTracing = class {};

/**
 * Initialiser Sentry pour React
 */
export const initSentry = () => {
  const dsn = process.env.REACT_APP_SENTRY_DSN;

  if (!dsn || dsn === 'your_sentry_dsn_here') {
    console.log('⚠️  Sentry DSN not configured. Error tracking disabled.');
    return false;
  }

  try {
    Sentry.init({
      dsn: dsn,
      environment: process.env.NODE_ENV || 'development',
      
      integrations: [
        new BrowserTracing({
          // Trace automatique des navigations
          tracePropagationTargets: ["localhost", /^https:\/\/.*\.your-domain\.com/],
        }),
      ],

      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Release tracking
      release: process.env.REACT_APP_VERSION || '1.0.0',
      
      // Filter des erreurs à envoyer
      beforeSend(event, hint) {
        // Ne pas envoyer les erreurs de validation normales
        if (event.exception) {
          const error = hint.originalException;
          if (error && error.response && error.response.status < 500) {
            return null; // Ignorer les erreurs client (< 500)
          }
        }
        return event;
      },
      
      // Ignorer certaines erreurs
      ignoreErrors: [
        // Erreurs réseau courantes
        'NetworkError',
        'Failed to fetch',
        'Network request failed',
        // Erreurs ResizeObserver (courantes et non critiques)
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        // Erreurs de validation React
        'Warning:',
        // Erreurs de hot reload en développement
        ...(process.env.NODE_ENV === 'development' ? [
          'Hot Module Replacement',
          'HMR',
        ] : []),
      ],
      
      // Filter des transactions
      beforeSendTransaction(event) {
        // Ne pas envoyer les transactions de développement
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        return event;
      },
    });

    console.log('✅ Sentry initialized for React');
    return true;
  } catch (error) {
    console.error('❌ Sentry initialization error:', error);
    return false;
  }
};

/**
 * Capturer une exception manuellement
 */
export const captureException = (error, context = {}) => {
  if (process.env.REACT_APP_SENTRY_DSN && process.env.REACT_APP_SENTRY_DSN !== 'your_sentry_dsn_here') {
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
export const captureMessage = (message, level = 'info', context = {}) => {
  if (process.env.REACT_APP_SENTRY_DSN && process.env.REACT_APP_SENTRY_DSN !== 'your_sentry_dsn_here') {
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
export const setUser = (user) => {
  if (process.env.REACT_APP_SENTRY_DSN && process.env.REACT_APP_SENTRY_DSN !== 'your_sentry_dsn_here') {
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
export const setContext = (name, context) => {
  if (process.env.REACT_APP_SENTRY_DSN && process.env.REACT_APP_SENTRY_DSN !== 'your_sentry_dsn_here') {
    Sentry.setContext(name, context);
  }
};

/**
 * Error Boundary avec Sentry
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;

