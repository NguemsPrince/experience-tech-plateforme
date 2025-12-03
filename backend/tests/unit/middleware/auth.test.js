const { protect, authorize } = require('../../../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

// Mock User model
jest.mock('../../../models/User');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      cookies: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('protect middleware', () => {
    it('should return 401 if no token provided', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Non autorisé')
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      req.headers.authorization = 'Bearer invalid-token';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should set user if token is valid', async () => {
      const token = jwt.sign(
        { id: '507f1f77bcf86cd799439011' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '7d' }
      );

      req.headers.authorization = `Bearer ${token}`;

      User.findById = jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'client',
        isActive: true
      });

      await protect(req, res, next);

      expect(User.findById).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      const token = jwt.sign(
        { id: '507f1f77bcf86cd799439011' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '7d' }
      );

      req.headers.authorization = `Bearer ${token}`;
      User.findById = jest.fn().mockResolvedValue(null);

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize middleware', () => {
    beforeEach(() => {
      req.user = {
        _id: '507f1f77bcf86cd799439011',
        role: 'client'
      };
    });

    it('should allow access for authorized role', () => {
      authorize('client', 'student')(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access for unauthorized role', () => {
      authorize('admin')(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Accès refusé')
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user has no role', () => {
      req.user.role = null;
      authorize('client')(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});

