// Mock Authentication System for Development
// This file provides a simple authentication system without database

export const mockUsers = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'Expérience Tech',
    email: 'admin@experiencetech-tchad.com',
    password: 'admin123', // In real app, this would be hashed
    role: 'admin',
    isActive: true,
    emailVerified: true,
    phone: '+23560290510',
    address: {
      street: 'Avenue Charles de Gaulle',
      city: 'N\'Djamena',
      country: 'Tchad',
      postalCode: '0000'
    },
    profile: {
      bio: 'Administrateur système de la plateforme Expérience Tech',
      avatar: null,
      website: 'https://experiencetech-tchad.com'
    },
    preferences: {
      language: 'fr',
      timezone: 'Africa/Ndjamena',
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    },
    lastLogin: new Date(),
    loginCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@test.com',
    password: 'demo123',
    role: 'client',
    isActive: true,
    emailVerified: true,
    phone: '+23560290511',
    address: {
      street: 'Avenue de la Paix',
      city: 'N\'Djamena',
      country: 'Tchad',
      postalCode: '0000'
    },
    profile: {
      bio: 'Utilisateur démo de la plateforme',
      avatar: null,
      website: null
    },
    preferences: {
      language: 'fr',
      timezone: 'Africa/Ndjamena',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    },
    lastLogin: new Date(),
    loginCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock authentication functions
export const mockAuth = {
  // Login function
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user && user.isActive) {
          // Update last login
          user.lastLogin = new Date();
          user.loginCount += 1;
          
          // Generate mock token
          const token = btoa(JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          }));
          
          resolve({
            success: true,
            data: {
              user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                phone: user.phone,
                address: user.address,
                profile: user.profile,
                preferences: user.preferences,
                lastLogin: user.lastLogin,
                loginCount: user.loginCount,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
              },
              token: token,
              refreshToken: token + '_refresh'
            },
            message: 'Connexion réussie'
          });
        } else {
          reject({
            success: false,
            message: 'Identifiants invalides'
          });
        }
      }, 1000); // Simulate API delay
    });
  },

  // Get current user
  getCurrentUser: async (token) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const decoded = JSON.parse(atob(token));
          
          if (decoded.exp < Date.now()) {
            reject({
              success: false,
              message: 'Token expiré'
            });
            return;
          }
          
          const user = mockUsers.find(u => u.id === decoded.id);
          
          if (user && user.isActive) {
            resolve({
              success: true,
              data: {
                user: {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  role: user.role,
                  isActive: user.isActive,
                  emailVerified: user.emailVerified,
                  phone: user.phone,
                  address: user.address,
                  profile: user.profile,
                  preferences: user.preferences,
                  lastLogin: user.lastLogin,
                  loginCount: user.loginCount,
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt
                }
              }
            });
          } else {
            reject({
              success: false,
              message: 'Utilisateur non trouvé'
            });
          }
        } catch (error) {
          reject({
            success: false,
            message: 'Token invalide'
          });
        }
      }, 500);
    });
  },

  // Logout function
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Déconnexion réussie'
        });
      }, 500);
    });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default mockAuth;
