/**
 * Utilitaires de gestion des permissions et rôles
 */

// Rôles disponibles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// Mapping des rôles backend vers rôles frontend
const ROLE_MAPPING = {
  'client': 'user',
  'student': 'user',
  'user': 'user',
  'moderator': 'admin', // Modérateur a accès au dashboard admin
  'admin': 'admin',
  'super_admin': 'admin'
};

// Normaliser le rôle
const normalizeRole = (role) => {
  return ROLE_MAPPING[role] || ROLES.GUEST;
};

// Pages autorisées par rôle
export const ALLOWED_PAGES = {
  [ROLES.ADMIN]: [
    '/',
    '/admin',
    '/admin/dashboard',
    '/admin/users',
    '/admin/projects',
    '/admin/settings',
    '/my-courses',
    '/cart',
    '/profile',
    '/training',
    '/services',
    '/products',
    '/news',
    '/about',
    '/contact',
    '/testimonials',
    '/search',
    '/forum'
  ],
  [ROLES.USER]: [
    '/',
    '/my-courses',
    '/cart',
    '/profile',
    '/training',
    '/services',
    '/products',
    '/news',
    '/about',
    '/contact',
    '/testimonials',
    '/search'
  ],
  [ROLES.GUEST]: [
    '/',
    '/training',
    '/services',
    '/products',
    '/news',
    '/about',
    '/contact',
    '/testimonials',
    '/search',
    '/login',
    '/register'
  ]
};

/**
 * Vérifie si un utilisateur a accès à une page donnée
 * @param {string} userRole - Le rôle de l'utilisateur
 * @param {string} pathname - Le chemin de la page
 * @returns {boolean} - True si l'utilisateur a accès
 */
export const hasAccess = (userRole, pathname) => {
  if (!userRole) {
    return ALLOWED_PAGES[ROLES.GUEST].some(page => 
      pathname === page || 
      (page !== '/' && pathname.startsWith(page + '/'))
    );
  }

  // Normaliser le rôle (client/student -> user)
  const normalizedRole = normalizeRole(userRole);
  const allowedPages = ALLOWED_PAGES[normalizedRole] || ALLOWED_PAGES[ROLES.GUEST];
  
  // Vérifier l'accès exact ou avec sous-chemins
  return allowedPages.some(page => 
    pathname === page || 
    (page !== '/' && pathname.startsWith(page + '/'))
  );
};

/**
 * Vérifie si un utilisateur est admin
 * @param {string} userRole - Le rôle de l'utilisateur
 * @returns {boolean} - True si l'utilisateur est admin
 */
export const isAdmin = (userRole) => {
  if (!userRole) return false;
  const normalizedRole = normalizeRole(userRole);
  return normalizedRole === ROLES.ADMIN;
};

/**
 * Vérifie si un utilisateur est connecté
 * @param {string} userRole - Le rôle de l'utilisateur
 * @returns {boolean} - True si l'utilisateur est connecté
 */
export const isAuthenticated = (userRole) => {
  if (!userRole) return false;
  const normalizedRole = normalizeRole(userRole);
  return normalizedRole === ROLES.ADMIN || normalizedRole === ROLES.USER;
};

/**
 * Obtient les pages autorisées pour un rôle
 * @param {string} userRole - Le rôle de l'utilisateur
 * @returns {Array} - Liste des pages autorisées
 */
export const getAllowedPages = (userRole) => {
  if (!userRole) return ALLOWED_PAGES[ROLES.GUEST];
  const normalizedRole = normalizeRole(userRole);
  return ALLOWED_PAGES[normalizedRole] || ALLOWED_PAGES[ROLES.GUEST];
};

/**
 * Vérifie si une page nécessite une authentification
 * @param {string} pathname - Le chemin de la page
 * @returns {boolean} - True si la page nécessite une authentification
 */
export const requiresAuth = (pathname) => {
  const authRequiredPages = [
    '/admin',
    '/my-courses',
    '/cart',
    '/profile'
  ];
  
  return authRequiredPages.some(page => 
    pathname === page || 
    (page !== '/' && pathname.startsWith(page + '/'))
  );
};

/**
 * Obtient la page de redirection appropriée selon le rôle
 * @param {string} userRole - Le rôle de l'utilisateur
 * @returns {string} - La page de redirection
 */
export const getRedirectPath = (userRole) => {
  switch (userRole) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.USER:
      return '/my-courses';
    default:
      return '/';
  }
};
