const { hasPermission, hasAnyPermission, hasAllPermissions, PERMISSIONS } = require('../utils/permissions');
const { sendErrorResponse } = require('../utils/response');

/**
 * Middleware pour vérifier une permission spécifique
 * @param {string|string[]} permission - Permission(s) requise(s)
 * @param {string} mode - 'any' (au moins une) ou 'all' (toutes)
 */
const checkPermission = (permission, mode = 'any') => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 401, 'Authentification requise');
    }

    const userRole = req.user.role;
    const permissions = Array.isArray(permission) ? permission : [permission];
    
    let hasAccess = false;
    
    if (mode === 'all') {
      hasAccess = hasAllPermissions(userRole, permissions);
    } else {
      hasAccess = hasAnyPermission(userRole, permissions);
    }

    if (!hasAccess) {
      return sendErrorResponse(
        res,
        403,
        `Accès refusé. Permission(s) requise(s): ${permissions.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Middleware pour vérifier si l'utilisateur peut effectuer une action sur une ressource
 * @param {string} action - L'action (create, read, update, delete)
 * @param {string} resource - La ressource (users, products, etc.)
 */
const checkResourceAccess = (action, resource) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendErrorResponse(res, 401, 'Authentification requise');
    }

    const userRole = req.user.role;
    
    // Super admin a toujours accès
    if (userRole === 'super_admin') {
      return next();
    }

    // Construire la permission attendue
    const permission = `${resource}:${action.toLowerCase()}`;
    
    // Vérifier la permission
    if (!hasPermission(userRole, permission)) {
      return sendErrorResponse(
        res,
        403,
        `Accès refusé. Vous n'avez pas la permission de ${action} ${resource}`
      );
    }

    next();
  };
};

/**
 * Middleware pour vérifier si l'utilisateur peut modifier un utilisateur
 * Les règles:
 * - Super admin peut modifier n'importe qui
 * - Admin peut modifier sauf super_admin
 * - Modérateur peut modifier sauf admin et super_admin
 * - Les autres ne peuvent modifier que leur propre compte
 */
const checkUserModificationAccess = (req, res, next) => {
  if (!req.user) {
    return sendErrorResponse(res, 401, 'Authentification requise');
  }

  const currentUser = req.user;
  const targetUserId = req.params.userId || req.params.id;
  const targetRole = req.body.role; // Si on essaie de changer le rôle

  // Super admin peut tout faire
  if (currentUser.role === 'super_admin') {
    return next();
  }

  // Si on essaie de modifier le rôle
  if (targetRole) {
    // Seul super_admin peut créer/modifier un super_admin
    if (targetRole === 'super_admin' && currentUser.role !== 'super_admin') {
      return sendErrorResponse(res, 403, 'Seul un super administrateur peut créer ou modifier un super administrateur');
    }
    
    // Seul super_admin peut créer/modifier un admin
    if (targetRole === 'admin' && currentUser.role !== 'super_admin') {
      return sendErrorResponse(res, 403, 'Seul un super administrateur peut créer ou modifier un administrateur');
    }
    
    // Modérateur ne peut pas créer/modifier un admin ou super_admin
    if ((targetRole === 'admin' || targetRole === 'super_admin') && currentUser.role === 'moderator') {
      return sendErrorResponse(res, 403, 'Un modérateur ne peut pas créer ou modifier un administrateur');
    }
  }

  // Si on modifie un autre utilisateur
  if (targetUserId && targetUserId.toString() !== currentUser._id.toString()) {
    // Admin peut modifier sauf super_admin
    if (currentUser.role === 'admin') {
      // Vérifier si la cible est un super_admin
      // On devra vérifier dans la route
      return next();
    }
    
    // Modérateur peut modifier sauf admin et super_admin
    if (currentUser.role === 'moderator') {
      // Vérifier si la cible est un admin ou super_admin
      // On devra vérifier dans la route
      return next();
    }
    
    // Les autres ne peuvent modifier que leur propre compte
    return sendErrorResponse(res, 403, 'Vous ne pouvez modifier que votre propre compte');
  }

  next();
};

module.exports = {
  checkPermission,
  checkResourceAccess,
  checkUserModificationAccess,
  PERMISSIONS
};

