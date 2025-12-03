// Import conditionnel pour éviter les erreurs si react-ga4 n'est pas disponible
let ReactGA = null;
try {
  ReactGA = require('react-ga4');
} catch (error) {
  console.warn('react-ga4 non disponible, analytics désactivés');
}

class AnalyticsService {
  constructor() {
    this.isInitialized = false;
    this.customEvents = [];
    this.userProperties = {};
    this.sessionStart = Date.now();
  }

  // Initialisation de Google Analytics
  init(measurementId) {
    if (this.isInitialized) return;
    
    if (!ReactGA) {
      console.warn('ReactGA non disponible, analytics désactivés');
      return;
    }
    
    try {
      ReactGA.initialize(measurementId, {
        gtagOptions: {
          send_page_view: false
        }
      });
      
      this.isInitialized = true;
      this.trackPageView(window.location.pathname);
      this.setupAutomaticTracking();
      
      console.log('Analytics initialisé avec succès');
    } catch (error) {
      console.error('Erreur initialisation Analytics:', error);
    }
  }

  // Configuration du tracking automatique
  setupAutomaticTracking() {
    // Tracking des pages
    this.trackPageViews();
    
    // Tracking des interactions
    this.trackUserInteractions();
    
    // Tracking des erreurs
    this.trackErrors();
    
    // Tracking des performances
    this.trackPerformance();
  }

  // Tracking des vues de pages
  trackPageViews() {
    // Tracking initial
    this.trackPageView(window.location.pathname);
    
    // Tracking des changements de route (React Router)
    let currentPath = window.location.pathname;
    
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.trackPageView(currentPath);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Tracking des interactions utilisateur
  trackUserInteractions() {
    // Tracking des clics sur les boutons
    document.addEventListener('click', (event) => {
      const button = event.target.closest('button, a, [role="button"]');
      if (button) {
        this.trackEvent('click', {
          element_type: button.tagName.toLowerCase(),
          element_id: button.id || 'no-id',
          element_class: button.className || 'no-class',
          element_text: button.textContent?.trim().substring(0, 100) || 'no-text',
          page: window.location.pathname
        });
      }
    });

    // Tracking des soumissions de formulaires
    document.addEventListener('submit', (event) => {
      this.trackEvent('form_submit', {
        form_id: event.target.id || 'no-id',
        form_class: event.target.className || 'no-class',
        page: window.location.pathname
      });
    });

    // Tracking des téléchargements
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[download]');
      if (link) {
        this.trackEvent('file_download', {
          file_name: link.download || 'unknown',
          file_url: link.href,
          page: window.location.pathname
        });
      }
    });
  }

  // Tracking des erreurs
  trackErrors() {
    // Erreurs JavaScript
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', {
        error_message: event.message,
        error_filename: event.filename,
        error_line: event.lineno,
        error_column: event.colno,
        page: window.location.pathname
      });
    });

    // Promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('unhandled_promise_rejection', {
        error_reason: event.reason?.toString() || 'unknown',
        page: window.location.pathname
      });
    });
  }

  // Tracking des performances
  trackPerformance() {
    // Tracking du temps de chargement
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      this.trackEvent('page_performance', {
        load_time: navigation.loadEventEnd - navigation.loadEventStart,
        dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        first_paint: this.getFirstPaint(),
        page: window.location.pathname
      });
    });

    // Tracking des Core Web Vitals
    this.trackCoreWebVitals();
  }

  // Tracking des Core Web Vitals
  trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.trackEvent('core_web_vital', {
        metric_name: 'LCP',
        metric_value: lastEntry.startTime,
        page: window.location.pathname
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.trackEvent('core_web_vital', {
          metric_name: 'FID',
          metric_value: entry.processingStart - entry.startTime,
          page: window.location.pathname
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.trackEvent('core_web_vital', {
        metric_name: 'CLS',
        metric_value: clsValue,
        page: window.location.pathname
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Méthodes publiques
  trackPageView(path) {
    if (!this.isInitialized || !ReactGA) return;
    
    try {
      ReactGA.send({ hitType: 'pageview', page: path });
    } catch (error) {
      console.warn('Erreur tracking page view:', error);
    }
    
    // Tracking personnalisé
    this.trackEvent('page_view', {
      page_path: path,
      page_title: document.title,
      timestamp: Date.now()
    });
  }

  trackEvent(eventName, parameters = {}) {
    if (!this.isInitialized || !ReactGA) return;
    
    // Tracking Google Analytics
    try {
      ReactGA.event({
        category: parameters.category || 'general',
        action: eventName,
        label: parameters.label || parameters.page || 'unknown',
        value: parameters.value || 0,
        custom_map: parameters
      });
    } catch (error) {
      console.warn('Erreur tracking event:', error);
    }
    
    // Tracking personnalisé
    const event = {
      name: eventName,
      parameters: {
        ...parameters,
        timestamp: Date.now(),
        session_id: this.getSessionId(),
        user_id: this.getUserId()
      }
    };
    
    this.customEvents.push(event);
    this.sendCustomEvent(event);
  }

  trackConversion(conversionData) {
    this.trackEvent('conversion', {
      conversion_type: conversionData.type,
      conversion_value: conversionData.value,
      conversion_currency: conversionData.currency || 'XOF',
      order_id: conversionData.orderId,
      page: window.location.pathname
    });
  }

  trackEcommerce(purchaseData) {
    if (!ReactGA) return;
    
    try {
      ReactGA.event({
        category: 'ecommerce',
        action: 'purchase',
        value: purchaseData.value,
        currency: purchaseData.currency || 'XOF',
        transaction_id: purchaseData.transactionId,
        items: purchaseData.items
      });
    } catch (error) {
      console.warn('Erreur tracking ecommerce:', error);
    }
  }

  setUserProperties(properties) {
    this.userProperties = { ...this.userProperties, ...properties };
    
    if (ReactGA) {
      try {
        ReactGA.set({
          user_id: properties.user_id,
          custom_map: properties
        });
      } catch (error) {
        console.warn('Erreur set user properties:', error);
      }
    }
  }

  setUserId(userId) {
    this.setUserProperties({ user_id: userId });
  }

  setUserRole(role) {
    this.setUserProperties({ user_role: role });
  }

  // Tracking des formations
  trackTrainingEnrollment(trainingData) {
    this.trackEvent('training_enrollment', {
      training_id: trainingData.id,
      training_title: trainingData.title,
      training_category: trainingData.category,
      training_price: trainingData.price,
      page: window.location.pathname
    });
  }

  trackTrainingCompletion(trainingData) {
    this.trackEvent('training_completion', {
      training_id: trainingData.id,
      training_title: trainingData.title,
      completion_time: trainingData.completionTime,
      page: window.location.pathname
    });
  }

  // Tracking des projets
  trackProjectCreation(projectData) {
    this.trackEvent('project_creation', {
      project_id: projectData.id,
      project_type: projectData.type,
      project_budget: projectData.budget,
      page: window.location.pathname
    });
  }

  trackProjectCompletion(projectData) {
    this.trackEvent('project_completion', {
      project_id: projectData.id,
      project_type: projectData.type,
      project_duration: projectData.duration,
      page: window.location.pathname
    });
  }

  // Tracking des paiements
  trackPaymentInitiation(paymentData) {
    this.trackEvent('payment_initiation', {
      payment_method: paymentData.method,
      payment_amount: paymentData.amount,
      payment_currency: paymentData.currency || 'XOF',
      page: window.location.pathname
    });
  }

  trackPaymentSuccess(paymentData) {
    this.trackEvent('payment_success', {
      payment_method: paymentData.method,
      payment_amount: paymentData.amount,
      transaction_id: paymentData.transactionId,
      page: window.location.pathname
    });
  }

  trackPaymentFailure(paymentData) {
    this.trackEvent('payment_failure', {
      payment_method: paymentData.method,
      payment_amount: paymentData.amount,
      error_reason: paymentData.error,
      page: window.location.pathname
    });
  }

  // Envoi d'événements personnalisés
  async sendCustomEvent(event) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Erreur envoi événement analytics:', error);
    }
  }

  // Utilitaires
  getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  getUserId() {
    return localStorage.getItem('user_id') || 'anonymous';
  }

  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  // Rapports personnalisés
  getCustomEvents() {
    return this.customEvents;
  }

  getSessionDuration() {
    return Date.now() - this.sessionStart;
  }

  // Export des données
  exportData() {
    return {
      customEvents: this.customEvents,
      userProperties: this.userProperties,
      sessionDuration: this.getSessionDuration(),
      sessionId: this.getSessionId(),
      userId: this.getUserId()
    };
  }
}

// Instance singleton
const analyticsService = new AnalyticsService();

export default analyticsService;
