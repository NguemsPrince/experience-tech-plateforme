// Système de permissions administrateur complet
// Tous les droits pour l'administrateur sur la plateforme

export const ADMIN_PERMISSIONS = {
  // Gestion des utilisateurs
  USER_MANAGEMENT: {
    CREATE_USERS: true,
    EDIT_USERS: true,
    DELETE_USERS: true,
    VIEW_ALL_USERS: true,
    CHANGE_USER_ROLES: true,
    ACTIVATE_DEACTIVATE_USERS: true,
    RESET_USER_PASSWORDS: true,
    EXPORT_USER_DATA: true,
    BULK_USER_OPERATIONS: true
  },

  // Gestion du contenu
  CONTENT_MANAGEMENT: {
    CREATE_ARTICLES: true,
    EDIT_ARTICLES: true,
    DELETE_ARTICLES: true,
    PUBLISH_UNPUBLISH: true,
    MANAGE_CATEGORIES: true,
    UPLOAD_MEDIA: true,
    MANAGE_SLIDES: true,
    EDIT_HOMEPAGE: true,
    MANAGE_MENUS: true
  },

  // Gestion des formations
  TRAINING_MANAGEMENT: {
    CREATE_COURSES: true,
    EDIT_COURSES: true,
    DELETE_COURSES: true,
    MANAGE_INSTRUCTORS: true,
    SET_COURSE_PRICES: true,
    MANAGE_ENROLLMENTS: true,
    GENERATE_CERTIFICATES: true,
    MANAGE_CATEGORIES: true,
    ANALYTICS: true
  },

  // Gestion des projets
  PROJECT_MANAGEMENT: {
    CREATE_PROJECTS: true,
    EDIT_PROJECTS: true,
    DELETE_PROJECTS: true,
    ASSIGN_PROJECTS: true,
    MANAGE_BUDGETS: true,
    TRACK_PROGRESS: true,
    GENERATE_REPORTS: true,
    MANAGE_CLIENTS: true,
    SET_DEADLINES: true
  },

  // Gestion des services
  SERVICE_MANAGEMENT: {
    CREATE_SERVICES: true,
    EDIT_SERVICES: true,
    DELETE_SERVICES: true,
    SET_SERVICE_PRICES: true,
    MANAGE_SERVICE_CATEGORIES: true,
    TRACK_SERVICE_USAGE: true,
    MANAGE_SERVICE_REQUESTS: true
  },

  // Gestion financière
  FINANCIAL_MANAGEMENT: {
    VIEW_ALL_REVENUES: true,
    MANAGE_INVOICES: true,
    PROCESS_PAYMENTS: true,
    GENERATE_FINANCIAL_REPORTS: true,
    MANAGE_PRICING: true,
    TRACK_EXPENSES: true,
    MANAGE_TAXES: true,
    EXPORT_FINANCIAL_DATA: true
  },

  // Gestion du support
  SUPPORT_MANAGEMENT: {
    VIEW_ALL_TICKETS: true,
    ASSIGN_TICKETS: true,
    RESOLVE_TICKETS: true,
    MANAGE_FAQS: true,
    CREATE_KNOWLEDGE_BASE: true,
    MANAGE_SUPPORT_TEAM: true,
    ANALYTICS: true
  },

  // Paramètres système
  SYSTEM_SETTINGS: {
    GENERAL_SETTINGS: true,
    SECURITY_SETTINGS: true,
    EMAIL_SETTINGS: true,
    PAYMENT_SETTINGS: true,
    INTEGRATION_SETTINGS: true,
    BACKUP_RESTORE: true,
    SYSTEM_LOGS: true,
    PERFORMANCE_MONITORING: true
  },

  // Analytics et rapports
  ANALYTICS: {
    USER_ANALYTICS: true,
    REVENUE_ANALYTICS: true,
    TRAINING_ANALYTICS: true,
    PROJECT_ANALYTICS: true,
    CUSTOM_REPORTS: true,
    EXPORT_DATA: true,
    REAL_TIME_MONITORING: true
  },

  // Gestion des rôles et permissions
  ROLE_MANAGEMENT: {
    CREATE_ROLES: true,
    EDIT_ROLES: true,
    DELETE_ROLES: true,
    ASSIGN_PERMISSIONS: true,
    MANAGE_ACCESS_LEVELS: true
  },

  // Gestion des notifications
  NOTIFICATION_MANAGEMENT: {
    SEND_NOTIFICATIONS: true,
    MANAGE_TEMPLATES: true,
    BULK_NOTIFICATIONS: true,
    EMAIL_CAMPAIGNS: true,
    SMS_CAMPAIGNS: true,
    PUSH_NOTIFICATIONS: true
  },

  // Gestion des intégrations
  INTEGRATION_MANAGEMENT: {
    MANAGE_APIS: true,
    WEBHOOKS: true,
    THIRD_PARTY_INTEGRATIONS: true,
    DATA_SYNC: true,
    API_KEYS: true
  }
};

// Fonction pour vérifier les permissions
export const hasPermission = (permission, userRole = 'admin') => {
  if (userRole === 'admin') {
    return true; // L'admin a tous les droits
  }
  
  // Pour d'autres rôles, on peut implémenter une logique plus fine
  return false;
};

// Fonction pour obtenir toutes les permissions d'un utilisateur
export const getUserPermissions = (userRole = 'admin') => {
  if (userRole === 'admin') {
    return ADMIN_PERMISSIONS;
  }
  
  // Retourner des permissions limitées pour d'autres rôles
  return {};
};

// Fonction pour vérifier si l'utilisateur peut accéder à une fonctionnalité
export const canAccess = (feature, userRole = 'admin') => {
  const permissions = getUserPermissions(userRole);
  
  // Vérifier si la permission existe dans la structure
  const keys = feature.split('.');
  let current = permissions;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return false;
    }
  }
  
  return current === true;
};

export default ADMIN_PERMISSIONS;
