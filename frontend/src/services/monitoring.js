class MonitoringService {
  constructor() {
    this.metrics = new Map();
    this.alerts = [];
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    // Initialiser le monitoring des performances
    this.trackPageLoad();
    this.trackUserInteractions();
    this.trackAPIResponses();
    this.trackErrors();
    
    this.isInitialized = true;
  }

  // Tracking des performances de chargement
  trackPageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        this.recordMetric('page_load_time', loadTime);
        this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        this.recordMetric('first_paint', this.getFirstPaint());
      });
    }
  }

  // Tracking des interactions utilisateur
  trackUserInteractions() {
    if (typeof window !== 'undefined') {
      // Tracking des clics
      document.addEventListener('click', (event) => {
        this.recordMetric('user_clicks', 1);
        this.recordEvent('click', {
          element: event.target.tagName,
          id: event.target.id,
          className: event.target.className
        });
      });

      // Tracking des scrolls
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.recordMetric('user_scrolls', 1);
        }, 100);
      });

      // Tracking des sessions
      this.trackSession();
    }
  }

  // Tracking des réponses API
  trackAPIResponses() {
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const startTime = performance.now();
        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          this.recordMetric('api_response_time', duration);
          this.recordMetric('api_success_rate', response.ok ? 1 : 0);
          
          if (!response.ok) {
            this.recordError('api_error', {
              url: args[0],
              status: response.status,
              statusText: response.statusText
            });
          }
          
          return response;
        } catch (error) {
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          this.recordMetric('api_response_time', duration);
          this.recordMetric('api_success_rate', 0);
          this.recordError('api_error', {
            url: args[0],
            error: error.message
          });
          
          throw error;
        }
      };
    }
  }

  // Tracking des erreurs
  trackErrors() {
    if (typeof window !== 'undefined') {
      // Erreurs JavaScript
      window.addEventListener('error', (event) => {
        this.recordError('javascript_error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      });

      // Promesses rejetées
      window.addEventListener('unhandledrejection', (event) => {
        this.recordError('unhandled_promise_rejection', {
          reason: event.reason,
          stack: event.reason?.stack
        });
      });
    }
  }

  // Tracking des sessions utilisateur
  trackSession() {
    const sessionId = this.getSessionId();
    const startTime = Date.now();
    
    // Tracking de la durée de session
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - startTime;
      this.recordMetric('session_duration', sessionDuration);
      this.sendSessionData(sessionId, sessionDuration);
    });
  }

  // Enregistrement des métriques
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name).push({
      value,
      timestamp: Date.now()
    });

    // Vérifier les seuils d'alerte
    this.checkAlertThresholds(name, value);
  }

  // Enregistrement des événements
  recordEvent(type, data) {
    const event = {
      type,
      data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Envoyer l'événement au backend
    this.sendEvent(event);
  }

  // Enregistrement des erreurs
  recordError(type, error) {
    const errorData = {
      type,
      error,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };

    this.alerts.push(errorData);
    this.sendError(errorData);
  }

  // Vérification des seuils d'alerte
  checkAlertThresholds(metricName, value) {
    const thresholds = {
      'page_load_time': 3000, // 3 secondes
      'api_response_time': 5000, // 5 secondes
      'api_success_rate': 0.95, // 95% de succès
      'session_duration': 3600000 // 1 heure
    };

    const threshold = thresholds[metricName];
    if (threshold && this.shouldAlert(metricName, value, threshold)) {
      this.createAlert(metricName, value, threshold);
    }
  }

  // Création d'alertes
  createAlert(metric, value, threshold) {
    const alert = {
      id: Date.now(),
      type: 'performance',
      metric,
      value,
      threshold,
      severity: this.getSeverity(metric, value, threshold),
      timestamp: Date.now(),
      message: `${metric} a dépassé le seuil: ${value} > ${threshold}`
    };

    this.alerts.push(alert);
    this.sendAlert(alert);
  }

  // Envoi des données au backend
  async sendEvent(event) {
    try {
      await fetch('/api/monitoring/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Erreur envoi événement:', error);
    }
  }

  async sendError(errorData) {
    try {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      });
    } catch (error) {
      console.error('Erreur envoi erreur:', error);
    }
  }

  async sendAlert(alert) {
    try {
      await fetch('/api/monitoring/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      console.error('Erreur envoi alerte:', error);
    }
  }

  async sendSessionData(sessionId, duration) {
    try {
      await fetch('/api/monitoring/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          duration,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Erreur envoi session:', error);
    }
  }

  // Utilitaires
  getSessionId() {
    let sessionId = sessionStorage.getItem('monitoring_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('monitoring_session_id', sessionId);
    }
    return sessionId;
  }

  getCurrentUserId() {
    // Récupérer l'ID utilisateur depuis le contexte d'authentification
    return localStorage.getItem('user_id') || 'anonymous';
  }

  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  shouldAlert(metric, value, threshold) {
    const recentValues = this.metrics.get(metric)?.slice(-10) || [];
    const avgValue = recentValues.reduce((sum, item) => sum + item.value, 0) / recentValues.length;
    
    return value > threshold && avgValue > threshold;
  }

  getSeverity(metric, value, threshold) {
    const ratio = value / threshold;
    if (ratio > 2) return 'critical';
    if (ratio > 1.5) return 'high';
    if (ratio > 1.2) return 'medium';
    return 'low';
  }

  // Méthodes publiques
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  getAlerts() {
    return this.alerts;
  }

  clearAlerts() {
    this.alerts = [];
  }

  getHealthStatus() {
    const criticalAlerts = this.alerts.filter(alert => alert.severity === 'critical');
    const highAlerts = this.alerts.filter(alert => alert.severity === 'high');
    
    if (criticalAlerts.length > 0) return 'critical';
    if (highAlerts.length > 2) return 'warning';
    return 'healthy';
  }
}

// Instance singleton
const monitoringService = new MonitoringService();

export default monitoringService;
