import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/auth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // SÉCURITÉ CRITIQUE : Initialiser isAuthenticated à false par défaut
  // Ne jamais supposer qu'un utilisateur est authentifié au démarrage
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // SÉCURITÉ CRITIQUE : Nettoyer immédiatement les tokens invalides au démarrage
  // Avant même de vérifier avec le backend
  useEffect(() => {
    // Vérifier immédiatement si le token est valide
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Si pas de token, nettoyer immédiatement
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      console.log('🔒 [SECURITY] Pas de token valide au démarrage, nettoyage immédiat');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return;
    }
    
    // Si un utilisateur est stocké mais pas de token valide, nettoyer
    if (userStr && (!token || token === 'null' || token === 'undefined')) {
      console.log('🔒 [SECURITY] Utilisateur stocké mais token invalide, nettoyage immédiat');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return;
    }
    
    // Si on arrive ici, il y a un token, vérifier avec le backend
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // SÉCURITÉ CRITIQUE : Vérifier si un token existe dans localStorage
      // Nettoyer immédiatement si le token est invalide
      const token = localStorage.getItem('token');
      
      // Vérifier que le token existe et est valide
      if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
        // Pas de token valide, nettoyer l'état IMMÉDIATEMENT
        console.log('🔒 Pas de token valide, nettoyage de l\'état d\'authentification');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setIsLoading(false);
        return;
      }

      // SÉCURITÉ CRITIQUE : Vérifier le token avec le backend
      // Ne JAMAIS considérer l'utilisateur comme authentifié sans vérification backend réussie
      try {
        const response = await authService.getCurrentUser();
        
        // SÉCURITÉ : Vérifier strictement que la réponse est valide
        // Ne pas faire confiance à une réponse partielle ou invalide
        if (response && response.success === true && response.data && response.data.user) {
          const userData = response.data.user;
          
          // SÉCURITÉ : Vérifier que l'utilisateur a bien un ID et un email
          if (userData._id || userData.id) {
            setUser(userData);
            setIsAuthenticated(true);
            // Mettre à jour localStorage avec les données utilisateur
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('✅ Authentification vérifiée avec succès pour:', userData.email);
          } else {
            // Réponse invalide - pas d'ID utilisateur
            console.error('🚫 Réponse invalide: utilisateur sans ID');
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        } else {
          // Token invalide ou réponse invalide, nettoyer IMMÉDIATEMENT
          console.warn('🚫 Token invalide ou réponse invalide:', {
            hasResponse: !!response,
            success: response?.success,
            hasData: !!response?.data,
            hasUser: !!response?.data?.user
          });
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      } catch (authError) {
        // SÉCURITÉ CRITIQUE : Toute erreur lors de la vérification = non authentifié
        // Ne JAMAIS considérer l'utilisateur comme authentifié en cas d'erreur
        console.error('🚫 Erreur de vérification du token:', {
          message: authError.message,
          status: authError.response?.status,
          code: authError.code
        });
        
        // NETTOYER IMMÉDIATEMENT pour toute erreur
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Log spécifique selon le type d'erreur (sans afficher de toast pour les erreurs réseau au chargement)
        if (authError.response?.status === 401 || authError.response?.status === 403) {
          console.warn('🚫 Token invalide ou expiré (401/403), nettoyage de l\'état');
        } else if (!authError.response) {
          // Erreur réseau - ne pas afficher de toast au chargement initial
          // C'est normal si le backend n'est pas encore démarré ou si l'utilisateur n'est pas connecté
          console.warn('🚫 Backend non accessible lors de la vérification initiale (normal si pas de token)');
        } else {
          console.warn('🚫 Erreur serveur lors de la vérification, nettoyage de l\'état');
        }
      }
    } catch (error) {
      console.error('Erreur générale lors de la vérification d\'authentification:', error);
      // En cas d'erreur, nettoyer complètement l'état
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        const userData = response.data.user;
        
        // SÉCURITÉ : Vérifier que le rôle est présent et valide
        if (!userData.role) {
          console.warn('⚠️ [useAuth] Rôle manquant dans la réponse, utilisation du rôle par défaut "client"');
          userData.role = 'client';
        }
        
        // S'assurer que le rôle est stocké dans localStorage
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('Connexion réussie !');
        
        console.log('✅ [useAuth] Utilisateur connecté:', {
          email: userData.email,
          role: userData.role
        });
        
        return { success: true, data: { ...response.data, user: userData } };
      } else {
        const errorMessage = response.message || 'Erreur de connexion';
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response,
        request: error.request
      });
      
      // Detect network errors - check both axios error structure and wrapped error structure
      let message = 'Erreur de connexion';
      const hasResponse = error.response !== undefined;
      const errorMessage = error.message || '';
      const errorCode = error.code || '';
      
      // Check if this is a network error (no response but has request)
      // Seulement pour les vraies erreurs réseau, pas pour les erreurs d'authentification normales
      const isRealNetworkError = !hasResponse && (
        errorCode === 'ECONNREFUSED' || 
        errorCode === 'ERR_NETWORK' || 
        errorMessage.includes('Network Error') ||
        errorMessage.includes('Failed to fetch')
      );
      
      if (isRealNetworkError) {
        // Network error - no response from server
        if (errorCode === 'ECONNABORTED' || errorMessage.includes('timeout')) {
          message = 'Délai d\'attente dépassé. Le serveur ne répond pas dans les temps impartis. Vérifiez que le serveur backend est démarré sur http://localhost:5000';
        } else if (errorMessage.includes('Network Error') || errorCode === 'ERR_NETWORK') {
          message = 'Erreur réseau. Le serveur backend n\'est pas accessible. Vérifiez que le serveur est démarré sur http://localhost:5000';
        } else if (errorCode === 'ENOTFOUND' || errorMessage.includes('getaddrinfo')) {
          message = 'Impossible de joindre le serveur. Vérifiez que le serveur backend est démarré sur http://localhost:5000';
        } else {
          message = 'Erreur réseau. Le serveur backend n\'est pas accessible. Vérifiez que le serveur est démarré sur http://localhost:5000 et que votre connexion internet fonctionne.';
        }
      } else if (hasResponse) {
        // Server returned a response with an error
        if (error.response?.data?.message) {
          message = error.response.data.message;
        } else if (error.response?.status === 401) {
          message = 'Identifiants invalides. Vérifiez votre email et mot de passe.';
        } else if (error.response?.status === 403) {
          message = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
        } else if (error.response?.status === 404) {
          message = 'Endpoint non trouvé. Vérifiez la configuration du serveur.';
        } else if (error.response?.status >= 500) {
          message = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else {
          message = errorMessage || 'Erreur de connexion. Veuillez réessayer.';
        }
      } else if (errorMessage) {
        // Generic error with message
        message = errorMessage;
      }
      
      // Ne jamais afficher de toast pour les erreurs réseau lors de la connexion
      // Les erreurs réseau sont déjà gérées par apiEnhanced qui ne montre pas de toast pour les vérifications
      // Afficher seulement pour les erreurs avec réponse du serveur (401, 403, etc.)
      if (hasResponse && error.response?.status !== 401) {
        // Ne pas afficher pour 401 (identifiants invalides) - c'est géré plus haut
        toast.error(message);
      }
      
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        toast.success('Inscription réussie !');
        return { success: true };
      } else {
        toast.error(response.message || 'Erreur lors de l\'inscription');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Déconnexion réussie !');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
