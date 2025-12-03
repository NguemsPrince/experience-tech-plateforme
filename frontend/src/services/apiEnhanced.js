import axios from 'axios';
import { toast } from 'react-hot-toast';

// Configuration de base
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT = 30000; // 30 secondes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

// Flag pour éviter les boucles infinies de refresh
let isRefreshing = false;
let failedQueue = [];

// Fonction pour gérer la file d'attente des requêtes échouées
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Créer l'instance axios avec configuration améliorée
const apiEnhanced = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour les cookies
});

// Intercepteur de requête
apiEnhanced.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ajouter la langue
    const language = localStorage.getItem('i18nextLng') || 'fr';
    config.headers['Accept-Language'] = language;
    
    // Ajouter un ID de requête pour le tracking
    config.headers['X-Request-Id'] = generateRequestId();
    
    // Log de la requête en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse avec gestion du refresh token
apiEnhanced.interceptors.response.use(
  (response) => {
    // Log de la réponse en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Gérer les erreurs 401 (Non autorisé) avec refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre en file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiEnhanced(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Vérifier si le refresh token est désactivé ou inexistant
      if (!refreshToken || refreshToken === 'disabled' || refreshToken === 'null') {
        // Pas de refresh token valide, rediriger vers login
        handleAuthError();
        return Promise.reject(error);
      }
      
      try {
        // Tenter de rafraîchir le token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });
        
        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        // Sauvegarder les nouveaux tokens
        if (newToken) {
          localStorage.setItem('token', newToken);
        }
        if (newRefreshToken && newRefreshToken !== 'disabled') {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        // Mettre à jour le header d'autorisation
        if (newToken) {
          apiEnhanced.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        // Traiter la file d'attente
        processQueue(null, newToken);
        
        return apiEnhanced(originalRequest);
      } catch (refreshError) {
        // Le refresh a échoué (endpoint inexistant ou token invalide), déconnecter l'utilisateur
        processQueue(refreshError, null);
        handleAuthError();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Gérer les erreurs 403 (Interdit)
    if (error.response?.status === 403) {
      toast.error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      window.location.href = '/access-denied';
    }
    
    // Gérer les erreurs 404 (Non trouvé)
    if (error.response?.status === 404) {
      const errorMessage = error.response.data?.message || 'Ressource non trouvée';
      toast.error(errorMessage);
    }
    
    // Gérer les erreurs 429 (Too Many Requests)
    if (error.response?.status === 429) {
      toast.error('Trop de requêtes. Veuillez patienter quelques instants.');
    }
    
    // Gérer les erreurs 500 (Erreur serveur)
    if (error.response?.status >= 500) {
      // Ne pas afficher de toast pour les erreurs serveur dans MyCourses
      // Le composant gère déjà l'affichage de l'erreur
      // toast.error('Erreur serveur. Veuillez réessayer plus tard.');
    }
    
    // Gérer les erreurs de timeout
    if (error.code === 'ECONNABORTED') {
      // Ne pas afficher pour les vérifications automatiques
      const isAutoCheck = originalRequest?.url?.includes('/auth/me') || 
                         originalRequest?.url?.includes('/health') ||
                         (originalRequest?.method?.toLowerCase() === 'get' && originalRequest?.url?.includes('/auth/'));
      
      if (!isAutoCheck) {
        const isUserAction = ['post', 'put', 'delete', 'patch'].includes(originalRequest?.method?.toLowerCase());
        if (isUserAction) {
          toast.error('Requête expirée. Veuillez vérifier votre connexion.');
        }
      }
    }
    
    // Gérer les erreurs réseau
    if (!error.response) {
      // Message plus spécifique pour les erreurs réseau
      const isBackendDown = error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error');
      if (isBackendDown) {
        // RÈGLE #1 : Vérifier IMMÉDIATEMENT si on est sur une page de login
        // Cette vérification doit être faite EN PREMIER, avant toute autre logique
        const isLoginPage = typeof window !== 'undefined' && window.location && (
          window.location.pathname.includes('/login') ||
          window.location.pathname.includes('/admin/login') ||
          window.location.pathname === '/login' ||
          window.location.pathname === '/admin/login' ||
          window.location.href.includes('/login') ||
          window.location.href.includes('/admin/login')
        );
        
        // Si on est sur une page de login, NE JAMAIS afficher de toast - sortir immédiatement
        if (isLoginPage) {
          console.log('[API] Backend check failed (silent - login page):', {
            url: originalRequest?.url,
            method: originalRequest?.method,
            pathname: window.location?.pathname
          });
          return Promise.reject(error.response?.data || error);
        }
        
        // Liste des URLs qui sont des vérifications automatiques - ne jamais afficher d'erreur pour celles-ci
        const isAuthCheck = originalRequest?.url?.includes('/auth/me') || 
                           originalRequest?.url?.includes('/auth/verify') ||
                           originalRequest?.url?.includes('/auth/check') ||
                           originalRequest?.url?.includes('/health');
        
        // Liste exhaustive des cas où on ne doit PAS afficher de toast :
        const isAutoCheck = isAuthCheck || 
                           (originalRequest?.method?.toLowerCase() === 'get' && originalRequest?.url?.includes('/auth/')) ||
                           (originalRequest?.method?.toLowerCase() === 'get' && originalRequest?.url?.includes('/health')) ||
                           (originalRequest?.method?.toLowerCase() === 'get' && originalRequest?.url?.includes('/status')) ||
                           // Ne pas afficher pour les GET en général (vérifications automatiques)
                           (originalRequest?.method?.toLowerCase() === 'get');
        
        // RÈGLE STRICTE : Ne JAMAIS afficher de toast d'erreur réseau si :
        // 1. C'est une vérification automatique (GET, /auth/me, /health, etc.)
        // 2. On est sur une page de login (où on affiche déjà un message d'aide)
        if (isAutoCheck || isLoginPage) {
          // Toujours logger pour le debugging, mais SANS toast
          console.log('[API] Backend check failed (silent):', {
            url: originalRequest?.url,
            method: originalRequest?.method,
            reason: isAutoCheck ? 'auto-check' : 'login-page'
          });
          // NE PAS afficher de toast - on sort immédiatement
          return Promise.reject(error.response?.data || error);
        }
        
        // Si on arrive ici, ce n'est PAS une vérification automatique ET on n'est PAS sur une page de login
        // Afficher UNIQUEMENT pour les actions utilisateur explicites (POST, PUT, DELETE, PATCH)
        const isUserAction = ['post', 'put', 'delete', 'patch'].includes(originalRequest?.method?.toLowerCase());
        
        if (isUserAction) {
          // Afficher le toast seulement pour les actions utilisateur critiques
          toast.error('Le serveur backend n\'est pas accessible. Vérifiez qu\'il est démarré sur http://localhost:5000');
        } else {
          // Pour toutes les autres méthodes, seulement logger sans afficher de toast
          console.warn('[API] Backend connection issue (silent):', {
            code: error.code,
            url: originalRequest?.url,
            method: originalRequest?.method
          });
        }
        console.error('[API] Backend not accessible:', error.code, error.message, 'URL:', originalRequest?.url, 'Method:', originalRequest?.method);
      } else {
        // toast.error('Erreur réseau. Vérifiez votre connexion internet.');
        console.error('[API] Network error:', error.code, error.message);
      }
    }
    
    // Log de l'erreur en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', error.response?.data || error.message);
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

// Fonction pour gérer les erreurs d'authentification
const handleAuthError = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  toast.error('Session expirée. Veuillez vous reconnecter.');
  
  // Éviter de rediriger si on est déjà sur la page de login
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Générer un ID unique pour chaque requête
const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Fonction utilitaire pour les requêtes avec retry automatique
export const requestWithRetry = async (requestFn, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      await sleep(delay);
      return requestWithRetry(requestFn, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

// Déterminer si une requête doit être réessayée
const shouldRetry = (error) => {
  // Réessayer uniquement pour les erreurs réseau et 5xx
  return (
    !error.response || 
    error.code === 'ECONNABORTED' ||
    (error.response && error.response.status >= 500)
  );
};

// Fonction utilitaire pour attendre
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Wrapper pour les requêtes GET avec cache
const cachedRequests = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCached = async (url, options = {}) => {
  const cacheKey = `${url}${JSON.stringify(options)}`;
  const cached = cachedRequests.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Cache] Using cached response for', url);
    }
    return cached.data;
  }
  
  const data = await apiEnhanced.get(url, options);
  cachedRequests.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
};

// Fonction pour vider le cache
export const clearCache = () => {
  cachedRequests.clear();
};

// Fonction pour upload de fichiers avec progression
export const uploadFile = (url, file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiEnhanced.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Fonction pour télécharger des fichiers
export const downloadFile = async (url, filename) => {
  try {
    const response = await apiEnhanced.get(url, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
    toast.success('Fichier téléchargé avec succès');
  } catch (error) {
    toast.error('Erreur lors du téléchargement du fichier');
    throw error;
  }
};

// Fonction pour les requêtes paginées
export const getPaginated = async (url, page = 1, limit = 10, params = {}) => {
  return apiEnhanced.get(url, {
    params: {
      page,
      limit,
      ...params
    }
  });
};

// Fonction pour les requêtes avec recherche
export const search = async (url, query, params = {}) => {
  return apiEnhanced.get(url, {
    params: {
      q: query,
      ...params
    }
  });
};

// API Health Check
export const healthCheck = async () => {
  try {
    const response = await apiEnhanced.get('/health');
    return response.status === 'success';
  } catch (error) {
    return false;
  }
};

// Vérifier la connexion périodiquement
let healthCheckInterval = null;

export const startHealthCheck = (interval = 60000) => { // Toutes les minutes par défaut
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  healthCheckInterval = setInterval(async () => {
    const isHealthy = await healthCheck();
    if (!isHealthy && process.env.NODE_ENV === 'development') {
      console.warn('[API Health Check] Server appears to be down');
    }
  }, interval);
};

export const stopHealthCheck = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
};

export default apiEnhanced;

