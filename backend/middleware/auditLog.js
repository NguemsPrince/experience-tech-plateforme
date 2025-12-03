const AuditLog = require('../models/AuditLog');

/**
 * Middleware pour logger automatiquement les actions administratives
 */
const auditLogMiddleware = (options = {}) => {
  return async (req, res, next) => {
    // Ne logger que les actions admin et modérateur
    if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin' || req.user.role === 'moderator')) {
      const originalSend = res.send;
      const startTime = Date.now();
      
      // Intercepter la réponse
      res.send = function(data) {
        res.send = originalSend;
        
        // Logger l'action après la réponse
        const duration = Date.now() - startTime;
        const status = res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'ERROR';
        
        // Détecter l'action et la ressource depuis la route
        const action = detectAction(req.method, res.statusCode);
        const resource = detectResource(req.path);
        
        if (action && resource) {
          AuditLog.log({
            user: req.user._id || req.user.id,
            action: action,
            resource: resource,
            resourceId: extractResourceId(req),
            beforeState: req.body?.beforeState || null,
            afterState: req.body || null,
            description: generateDescription(req, action, resource),
            details: {
              method: req.method,
              path: req.path,
              statusCode: res.statusCode,
              query: req.query
            },
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            status: status,
            errorMessage: status === 'ERROR' ? (typeof data === 'string' ? data : JSON.stringify(data)) : null,
            duration: duration,
            metadata: {
              params: req.params,
              query: req.query
            }
          }).catch(err => {
            console.error('Failed to create audit log:', err);
          });
        }
        
        return originalSend.call(this, data);
      };
    }
    
    next();
  };
};

/**
 * Détecter l'action depuis la méthode HTTP
 */
function detectAction(method, statusCode) {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'VIEW';
    case 'POST':
      return statusCode === 201 ? 'CREATE' : 'UPDATE';
    case 'PUT':
    case 'PATCH':
      return 'UPDATE';
    case 'DELETE':
      return 'DELETE';
    default:
      return null;
  }
}

/**
 * Détecter la ressource depuis le chemin
 */
function detectResource(path) {
  const pathLower = path.toLowerCase();
  
  if (pathLower.includes('/users')) return 'USER';
  if (pathLower.includes('/orders')) return 'ORDER';
  if (pathLower.includes('/products')) return 'PRODUCT';
  if (pathLower.includes('/courses') || pathLower.includes('/training')) return 'COURSE';
  if (pathLower.includes('/content') || pathLower.includes('/articles')) return 'CONTENT';
  if (pathLower.includes('/settings')) return 'SETTINGS';
  if (pathLower.includes('/payments')) return 'PAYMENT';
  if (pathLower.includes('/messages') || pathLower.includes('/contact')) return 'MESSAGE';
  if (pathLower.includes('/quotes') || pathLower.includes('/quote-requests')) return 'QUOTE_REQUEST';
  if (pathLower.includes('/job-applications') || pathLower.includes('/applications')) return 'JOB_APPLICATION';
  if (pathLower.includes('/chatbot-questions')) return 'CHATBOT_QUESTION';
  if (pathLower.includes('/tickets')) return 'TICKET';
  if (pathLower.includes('/forum/posts')) return 'FORUM_POST';
  if (pathLower.includes('/forum/comments')) return 'FORUM_COMMENT';
  if (pathLower.includes('/permissions')) return 'PERMISSION';
  if (pathLower.includes('/roles')) return 'ROLE';
  if (pathLower.includes('/backup')) return 'BACKUP';
  
  return 'SYSTEM';
}

/**
 * Extraire l'ID de la ressource depuis les paramètres
 */
function extractResourceId(req) {
  return req.params.id || 
         req.params.userId || 
         req.params.orderId || 
         req.params.productId || 
         req.params.courseId ||
         req.body?.id ||
         null;
}

/**
 * Générer une description de l'action
 */
function generateDescription(req, action, resource) {
  const method = req.method;
  const path = req.path;
  const resourceName = resource.toLowerCase().replace('_', ' ');
  
  switch (action) {
    case 'CREATE':
      return `Création d'un(e) ${resourceName}`;
    case 'UPDATE':
      return `Modification d'un(e) ${resourceName}`;
    case 'DELETE':
      return `Suppression d'un(e) ${resourceName}`;
    case 'VIEW':
      return `Consultation des ${resourceName}s`;
    default:
      return `${action} sur ${resourceName}`;
  }
}

/**
 * Fonction helper pour logger manuellement
 */
const logAction = async (req, action, resource, data = {}) => {
  if (!req.user) return null;
  
  return await AuditLog.log({
    user: req.user._id || req.user.id,
    action: action,
    resource: resource,
    resourceId: data.resourceId,
    beforeState: data.beforeState,
    afterState: data.afterState,
    description: data.description || `${action} sur ${resource}`,
    details: data.details || {},
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    status: data.status || 'SUCCESS',
    errorMessage: data.errorMessage,
    duration: data.duration,
    metadata: data.metadata || {}
  });
};

module.exports = {
  auditLogMiddleware,
  logAction
};

