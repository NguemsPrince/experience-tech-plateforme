import apiEnhanced from './apiEnhanced';

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await apiEnhanced.post('/auth/register', userData);
    
    // Store tokens if provided
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    return {
      success: response.success,
      message: response.message,
      data: { user: response.data?.user }
    };
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiEnhanced.post('/auth/login', credentials);
      
      // Store tokens
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      // Store user in localStorage
      if (response.data?.user || response.user) {
        const user = response.data?.user || response.user;
        
        // SÉCURITÉ : S'assurer que le rôle est présent
        if (!user.role) {
          console.warn('⚠️ [authService] Rôle manquant, utilisation du rôle par défaut "client"');
          user.role = 'client';
        }
        
        // Vérifier que le rôle n'est pas admin pour les nouveaux utilisateurs
        if (user.role === 'admin' || user.role === 'super_admin') {
          console.log('🔐 [authService] Utilisateur admin détecté:', user.email);
        } else {
          console.log('👤 [authService] Utilisateur client détecté:', user.email, 'Rôle:', user.role);
        }
        
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Return response in expected format
      return {
        success: response.success !== false, // Default to true if not specified
        data: {
          user: response.data?.user || response.user,
          token: response.token,
          refreshToken: response.refreshToken
        },
        message: response.message
      };
    } catch (error) {
      // Re-throw error so useAuth can handle it
      // The error will be caught by useAuth.login
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await apiEnhanced.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return await apiEnhanced.get('/auth/me');
  },

  // Update user details
  updateDetails: async (userData) => {
    return await apiEnhanced.put('/auth/updatedetails', userData);
  },

  // Update password
  updatePassword: async (passwordData) => {
    return await apiEnhanced.put('/auth/updatepassword', passwordData);
  },

  // Forgot password
  forgotPassword: async (email) => {
    return await apiEnhanced.post('/auth/forgotpassword', { email });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return await apiEnhanced.put(`/auth/resetpassword/${token}`, { password });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken || refreshToken === 'disabled' || refreshToken === 'null') {
      throw new Error('No valid refresh token found');
    }
    
    try {
      const response = await apiEnhanced.post('/auth/refresh', { refreshToken });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      if (response.refreshToken && response.refreshToken !== 'disabled') {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      return response;
    } catch (error) {
      // Si le refresh échoue, nettoyer les tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  }
};
