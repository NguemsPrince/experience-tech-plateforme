/**
 * Tests pour le service d'authentification
 */

import * as authService from '../../services/auth';
import api from '../../services/apiEnhanced';

// Mock de l'API
jest.mock('../../services/apiEnhanced');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'Password123!'
      };

      const mockResponse = {
        data: {
          success: true,
          token: 'mock-jwt-token',
          data: {
            user: {
              ...mockUser,
              _id: '507f1f77bcf86cd799439011'
            }
          }
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.register(mockUser);

      expect(api.post).toHaveBeenCalledWith('/auth/register', mockUser);
      expect(result.success).toBe(true);
      expect(result.token).toBe('mock-jwt-token');
      expect(result.data.user.email).toBe(mockUser.email);
    });

    it('should handle registration errors', async () => {
      const mockUser = {
        email: 'existing@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'Password123!'
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            success: false,
            message: 'Email already exists'
          }
        }
      };

      api.post.mockRejectedValue(mockError);

      await expect(authService.register(mockUser)).rejects.toEqual(mockError);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const mockResponse = {
        data: {
          success: true,
          token: 'mock-jwt-token',
          data: {
            user: {
              email: credentials.email,
              _id: '507f1f77bcf86cd799439011'
            }
          }
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login(credentials);

      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result.success).toBe(true);
      expect(result.token).toBe('mock-jwt-token');
    });

    it('should handle login errors', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword'
      };

      const mockError = {
        response: {
          status: 401,
          data: {
            success: false,
            message: 'Invalid credentials'
          }
        }
      };

      api.post.mockRejectedValue(mockError);

      await expect(authService.login(credentials)).rejects.toEqual(mockError);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Logged out successfully'
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
      expect(result.success).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      };

      const mockResponse = {
        data: {
          success: true,
          data: mockUser
        }
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result.success).toBe(true);
      expect(result.data.email).toBe(mockUser.email);
    });
  });
});

