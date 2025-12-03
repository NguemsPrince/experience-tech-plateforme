/**
 * Configuration Redis pour le cache
 */

const Redis = require('ioredis');

let redisClient = null;

/**
 * Initialiser la connexion Redis
 */
const initRedis = () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true; // Reconnect on readonly error
        }
        return false;
      },
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
      // En développement, continuer sans Redis
      if (process.env.NODE_ENV === 'production') {
        // En production, log l'erreur mais continue
        console.warn('Redis unavailable, continuing without cache');
      }
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis ready');
    });

    // Connecter Redis
    redisClient.connect().catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Redis not available, running without cache');
      }
    });

    return redisClient;
  } catch (error) {
    console.error('Redis initialization error:', error);
    return null;
  }
};

/**
 * Obtenir le client Redis
 */
const getRedisClient = () => {
  if (!redisClient) {
    redisClient = initRedis();
  }
  return redisClient;
};

/**
 * Vérifier si Redis est disponible
 */
const isRedisAvailable = () => {
  return redisClient && redisClient.status === 'ready';
};

/**
 * Service de cache
 */
const cacheService = {
  /**
   * Obtenir une valeur du cache
   */
  async get(key) {
    if (!isRedisAvailable()) {
      return null;
    }

    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  /**
   * Définir une valeur dans le cache
   */
  async set(key, value, ttlSeconds = 3600) {
    if (!isRedisAvailable()) {
      return false;
    }

    try {
      const stringValue = JSON.stringify(value);
      await redisClient.setex(key, ttlSeconds, stringValue);
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  },

  /**
   * Supprimer une clé du cache
   */
  async del(key) {
    if (!isRedisAvailable()) {
      return false;
    }

    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Redis del error:', error);
      return false;
    }
  },

  /**
   * Supprimer plusieurs clés (pattern matching)
   */
  async delPattern(pattern) {
    if (!isRedisAvailable()) {
      return false;
    }

    try {
      const stream = redisClient.scanStream({
        match: pattern,
        count: 100
      });

      const keys = [];
      stream.on('data', (resultKeys) => {
        keys.push(...resultKeys);
      });

      return new Promise((resolve) => {
        stream.on('end', async () => {
          if (keys.length > 0) {
            await redisClient.del(...keys);
          }
          resolve(true);
        });
      });
    } catch (error) {
      console.error('Redis delPattern error:', error);
      return false;
    }
  },

  /**
   * Vérifier si une clé existe
   */
  async exists(key) {
    if (!isRedisAvailable()) {
      return false;
    }

    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  },

  /**
   * Obtenir le TTL d'une clé
   */
  async ttl(key) {
    if (!isRedisAvailable()) {
      return -1;
    }

    try {
      return await redisClient.ttl(key);
    } catch (error) {
      console.error('Redis ttl error:', error);
      return -1;
    }
  },

  /**
   * Incrémenter une valeur
   */
  async increment(key, amount = 1) {
    if (!isRedisAvailable()) {
      return null;
    }

    try {
      return await redisClient.incrby(key, amount);
    } catch (error) {
      console.error('Redis increment error:', error);
      return null;
    }
  }
};

// Initialiser Redis au démarrage
initRedis();

module.exports = {
  getRedisClient,
  isRedisAvailable,
  cacheService
};

