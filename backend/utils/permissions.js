/**
 * Système de permissions granulaires pour la plateforme
 * Définit les permissions par rôle et fournit des fonctions de vérification
 */

// Définition des permissions disponibles
const PERMISSIONS = {
  // Gestion des utilisateurs
  USERS: {
    VIEW: 'users:view',
    CREATE: 'users:create',
    EDIT: 'users:edit',
    DELETE: 'users:delete',
    CHANGE_ROLE: 'users:change_role',
    ACTIVATE_DEACTIVATE: 'users:activate_deactivate',
    RESET_PASSWORD: 'users:reset_password',
    EXPORT: 'users:export',
    BULK_OPERATIONS: 'users:bulk_operations'
  },
  
  // Gestion des produits
  PRODUCTS: {
    VIEW: 'products:view',
    CREATE: 'products:create',
    EDIT: 'products:edit',
    DELETE: 'products:delete',
    MANAGE_STOCK: 'products:manage_stock',
    MANAGE_PRICES: 'products:manage_prices',
    PUBLISH_UNPUBLISH: 'products:publish_unpublish'
  },
  
  // Gestion des formations
  COURSES: {
    VIEW: 'courses:view',
    CREATE: 'courses:create',
    EDIT: 'courses:edit',
    DELETE: 'courses:delete',
    MANAGE_ENROLLMENTS: 'courses:manage_enrollments',
    MANAGE_INSTRUCTORS: 'courses:manage_instructors',
    SET_PRICES: 'courses:set_prices',
    GENERATE_CERTIFICATES: 'courses:generate_certificates'
  },
  
  // Gestion des commandes
  ORDERS: {
    VIEW: 'orders:view',
    CREATE: 'orders:create',
    EDIT: 'orders:edit',
    DELETE: 'orders:delete',
    UPDATE_STATUS: 'orders:update_status',
    PROCESS_PAYMENTS: 'orders:process_payments',
    EXPORT: 'orders:export'
  },
  
  // Gestion du contenu
  CONTENT: {
    VIEW: 'content:view',
    CREATE: 'content:create',
    EDIT: 'content:edit',
    DELETE: 'content:delete',
    PUBLISH_UNPUBLISH: 'content:publish_unpublish',
    MANAGE_CATEGORIES: 'content:manage_categories'
  },
  
  // Gestion du support
  SUPPORT: {
    VIEW_TICKETS: 'support:view_tickets',
    CREATE_TICKETS: 'support:create_tickets',
    EDIT_TICKETS: 'support:edit_tickets',
    DELETE_TICKETS: 'support:delete_tickets',
    ASSIGN_TICKETS: 'support:assign_tickets',
    RESOLVE_TICKETS: 'support:resolve_tickets',
    VIEW_MESSAGES: 'support:view_messages',
    REPLY_MESSAGES: 'support:reply_messages'
  },
  
  // Gestion du forum
  FORUM: {
    VIEW: 'forum:view',
    MODERATE_POSTS: 'forum:moderate_posts',
    DELETE_POSTS: 'forum:delete_posts',
    BAN_USERS: 'forum:ban_users',
    MANAGE_CATEGORIES: 'forum:manage_categories'
  },
  
  // Paramètres système
  SETTINGS: {
    VIEW: 'settings:view',
    EDIT_GENERAL: 'settings:edit_general',
    EDIT_SECURITY: 'settings:edit_security',
    EDIT_PAYMENT: 'settings:edit_payment',
    EDIT_EMAIL: 'settings:edit_email',
    BACKUP_RESTORE: 'settings:backup_restore',
    VIEW_LOGS: 'settings:view_logs'
  },
  
  // Analytics et rapports
  ANALYTICS: {
    VIEW: 'analytics:view',
    EXPORT: 'analytics:export',
    VIEW_FINANCIAL: 'analytics:view_financial'
  },
  
  // Audit logs
  AUDIT: {
    VIEW: 'audit:view',
    EXPORT: 'audit:export'
  }
};

// Permissions par rôle
const ROLE_PERMISSIONS = {
  // Client - permissions minimales
  client: [
    PERMISSIONS.ORDERS.VIEW,
    PERMISSIONS.COURSES.VIEW,
    PERMISSIONS.PRODUCTS.VIEW,
    PERMISSIONS.SUPPORT.CREATE_TICKETS,
    PERMISSIONS.FORUM.VIEW
  ],
  
  // Étudiant - permissions de base
  student: [
    PERMISSIONS.ORDERS.VIEW,
    PERMISSIONS.COURSES.VIEW,
    PERMISSIONS.PRODUCTS.VIEW,
    PERMISSIONS.SUPPORT.CREATE_TICKETS,
    PERMISSIONS.FORUM.VIEW
  ],
  
  // Modérateur - permissions de modération
  moderator: [
    // Lecture
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.PRODUCTS.VIEW,
    PERMISSIONS.COURSES.VIEW,
    PERMISSIONS.ORDERS.VIEW,
    PERMISSIONS.CONTENT.VIEW,
    PERMISSIONS.SUPPORT.VIEW_TICKETS,
    PERMISSIONS.SUPPORT.VIEW_MESSAGES,
    PERMISSIONS.FORUM.VIEW,
    PERMISSIONS.ANALYTICS.VIEW,
    
    // Modération
    PERMISSIONS.FORUM.MODERATE_POSTS,
    PERMISSIONS.FORUM.DELETE_POSTS,
    PERMISSIONS.FORUM.MANAGE_CATEGORIES,
    PERMISSIONS.SUPPORT.EDIT_TICKETS,
    PERMISSIONS.SUPPORT.ASSIGN_TICKETS,
    PERMISSIONS.SUPPORT.RESOLVE_TICKETS,
    PERMISSIONS.SUPPORT.REPLY_MESSAGES,
    PERMISSIONS.CONTENT.EDIT,
    PERMISSIONS.CONTENT.PUBLISH_UNPUBLISH,
    
    // Audit
    PERMISSIONS.AUDIT.VIEW
  ],
  
  // Admin - permissions étendues
  admin: [
    // Toutes les permissions de modérateur
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.EDIT,
    PERMISSIONS.USERS.DELETE,
    PERMISSIONS.USERS.CHANGE_ROLE,
    PERMISSIONS.USERS.ACTIVATE_DEACTIVATE,
    PERMISSIONS.USERS.RESET_PASSWORD,
    PERMISSIONS.USERS.EXPORT,
    
    PERMISSIONS.PRODUCTS.VIEW,
    PERMISSIONS.PRODUCTS.CREATE,
    PERMISSIONS.PRODUCTS.EDIT,
    PERMISSIONS.PRODUCTS.DELETE,
    PERMISSIONS.PRODUCTS.MANAGE_STOCK,
    PERMISSIONS.PRODUCTS.MANAGE_PRICES,
    PERMISSIONS.PRODUCTS.PUBLISH_UNPUBLISH,
    
    PERMISSIONS.COURSES.VIEW,
    PERMISSIONS.COURSES.CREATE,
    PERMISSIONS.COURSES.EDIT,
    PERMISSIONS.COURSES.DELETE,
    PERMISSIONS.COURSES.MANAGE_ENROLLMENTS,
    PERMISSIONS.COURSES.MANAGE_INSTRUCTORS,
    PERMISSIONS.COURSES.SET_PRICES,
    PERMISSIONS.COURSES.GENERATE_CERTIFICATES,
    
    PERMISSIONS.ORDERS.VIEW,
    PERMISSIONS.ORDERS.CREATE,
    PERMISSIONS.ORDERS.EDIT,
    PERMISSIONS.ORDERS.DELETE,
    PERMISSIONS.ORDERS.UPDATE_STATUS,
    PERMISSIONS.ORDERS.PROCESS_PAYMENTS,
    PERMISSIONS.ORDERS.EXPORT,
    
    PERMISSIONS.CONTENT.VIEW,
    PERMISSIONS.CONTENT.CREATE,
    PERMISSIONS.CONTENT.EDIT,
    PERMISSIONS.CONTENT.DELETE,
    PERMISSIONS.CONTENT.PUBLISH_UNPUBLISH,
    PERMISSIONS.CONTENT.MANAGE_CATEGORIES,
    
    PERMISSIONS.SUPPORT.VIEW_TICKETS,
    PERMISSIONS.SUPPORT.CREATE_TICKETS,
    PERMISSIONS.SUPPORT.EDIT_TICKETS,
    PERMISSIONS.SUPPORT.DELETE_TICKETS,
    PERMISSIONS.SUPPORT.ASSIGN_TICKETS,
    PERMISSIONS.SUPPORT.RESOLVE_TICKETS,
    PERMISSIONS.SUPPORT.VIEW_MESSAGES,
    PERMISSIONS.SUPPORT.REPLY_MESSAGES,
    
    PERMISSIONS.FORUM.VIEW,
    PERMISSIONS.FORUM.MODERATE_POSTS,
    PERMISSIONS.FORUM.DELETE_POSTS,
    PERMISSIONS.FORUM.BAN_USERS,
    PERMISSIONS.FORUM.MANAGE_CATEGORIES,
    
    PERMISSIONS.SETTINGS.VIEW,
    PERMISSIONS.SETTINGS.EDIT_GENERAL,
    PERMISSIONS.SETTINGS.EDIT_SECURITY,
    PERMISSIONS.SETTINGS.EDIT_PAYMENT,
    PERMISSIONS.SETTINGS.EDIT_EMAIL,
    PERMISSIONS.SETTINGS.VIEW_LOGS,
    
    PERMISSIONS.ANALYTICS.VIEW,
    PERMISSIONS.ANALYTICS.EXPORT,
    PERMISSIONS.ANALYTICS.VIEW_FINANCIAL,
    
    PERMISSIONS.AUDIT.VIEW,
    PERMISSIONS.AUDIT.EXPORT
  ],
  
  // Super Admin - toutes les permissions
  super_admin: Object.values(PERMISSIONS).flatMap(category => Object.values(category))
};

/**
 * Vérifie si un rôle a une permission spécifique
 * @param {string} role - Le rôle de l'utilisateur
 * @param {string} permission - La permission à vérifier
 * @returns {boolean}
 */
function hasPermission(role, permission) {
  if (!role || !permission) return false;
  
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  
  // Super admin a toutes les permissions
  if (role === 'super_admin') return true;
  
  return rolePerms.includes(permission);
}

/**
 * Vérifie si un rôle a au moins une des permissions spécifiées
 * @param {string} role - Le rôle de l'utilisateur
 * @param {string[]} permissions - Les permissions à vérifier
 * @returns {boolean}
 */
function hasAnyPermission(role, permissions) {
  if (!role || !permissions || permissions.length === 0) return false;
  return permissions.some(perm => hasPermission(role, perm));
}

/**
 * Vérifie si un rôle a toutes les permissions spécifiées
 * @param {string} role - Le rôle de l'utilisateur
 * @param {string[]} permissions - Les permissions à vérifier
 * @returns {boolean}
 */
function hasAllPermissions(role, permissions) {
  if (!role || !permissions || permissions.length === 0) return false;
  return permissions.every(perm => hasPermission(role, perm));
}

/**
 * Obtient toutes les permissions d'un rôle
 * @param {string} role - Le rôle de l'utilisateur
 * @returns {string[]}
 */
function getRolePermissions(role) {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Vérifie si un rôle peut effectuer une action sur une ressource
 * @param {string} role - Le rôle de l'utilisateur
 * @param {string} action - L'action (create, read, update, delete)
 * @param {string} resource - La ressource (users, products, etc.)
 * @returns {boolean}
 */
function canPerformAction(role, action, resource) {
  const permissionMap = {
    'create': 'CREATE',
    'read': 'VIEW',
    'view': 'VIEW',
    'update': 'EDIT',
    'edit': 'EDIT',
    'delete': 'DELETE',
    'remove': 'DELETE'
  };
  
  const actionUpper = permissionMap[action.toLowerCase()] || action.toUpperCase();
  const resourceUpper = resource.toUpperCase();
  
  // Construire la permission attendue
  const permission = `${resource}:${action.toLowerCase()}`;
  
  // Vérifier dans les permissions spécifiques
  if (PERMISSIONS[resourceUpper]) {
    const permKey = Object.keys(PERMISSIONS[resourceUpper]).find(
      key => PERMISSIONS[resourceUpper][key].includes(action.toLowerCase())
    );
    if (permKey) {
      return hasPermission(role, PERMISSIONS[resourceUpper][permKey]);
    }
  }
  
  // Fallback: vérifier les permissions génériques
  return hasPermission(role, permission);
}

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canPerformAction
};

