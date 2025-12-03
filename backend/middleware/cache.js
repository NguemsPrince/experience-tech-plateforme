/**
 * Middleware de cache Redis
 */

const { cacheService } = require('../config/redis');

/**
 * Middleware pour mettre en cache les réponses GET
 */
const cacheMiddleware = (ttlSeconds = 3600, keyGenerator = null) => {
  return async (req, res, next) => {
    // Ne mettre en cache que les requêtes GET
    if (req.method !== 'GET') {
      return next();
    }

    // Générer la clé de cache
    const cacheKey = keyGenerator 
      ? keyGenerator(req)
      : `cache:${req.originalUrl}:${JSON.stringify(req.query)}:${req.user?.id || 'anonymous'}`;

    try {
      // Vérifier si la réponse est en cache
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        // Retourner les données en cache
        return res.status(200).json(cachedData);
      }

      // Si pas en cache, sauvegarder la fonction json originale
      const originalJson = res.json.bind(res);

      // Override res.json pour mettre en cache avant d'envoyer
      res.json = function(data) {
        // Mettre en cache seulement les réponses réussies
        if (res.statusCode === 200 && data.success !== false) {
          cacheService.set(cacheKey, data, ttlSeconds).catch(err => {
            console.error('Cache set error:', err);
          });
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      // En cas d'erreur, continuer sans cache
      next();
    }
  };
};

/**
 * Invalider le cache par pattern
 */
const invalidateCache = async (pattern) => {
  try {
    await cacheService.delPattern(pattern);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

/**
 * Invalider le cache pour un utilisateur spécifique
 */
const invalidateUserCache = async (userId) => {
  await invalidateCache(`cache:*:${userId}`);
};

/**
 * Invalider le cache pour une route spécifique
 */
const invalidateRouteCache = async (route) => {
  await invalidateCache(`cache:${route}*`);
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  invalidateUserCache,
  invalidateRouteCache
};

