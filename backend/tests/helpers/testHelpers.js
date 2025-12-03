/**
 * Helpers pour les tests
 */

const jwt = require('jsonwebtoken');
const User = require('../../models/User');

/**
 * Créer un token JWT de test
 */
const generateTestToken = (userData = {}) => {
  const payload = {
    id: userData.id || '507f1f77bcf86cd799439011',
    email: userData.email || 'test@example.com',
    role: userData.role || 'client'
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '7d'
  });
};

/**
 * Créer un utilisateur de test
 */
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'Test123456!',
    firstName: 'Test',
    lastName: 'User',
    role: 'client',
    isActive: true,
    ...userData
  };

  // Si password est fourni, le hasher
  if (defaultUser.password) {
    const bcrypt = require('bcryptjs');
    defaultUser.password = await bcrypt.hash(defaultUser.password, 10);
  }

  return await User.create(defaultUser);
};

/**
 * Nettoyer la base de données de test
 */
const cleanDatabase = async () => {
  const models = [
    'User',
    'Course',
    'Product',
    'Order',
    'Payment',
    'Enrollment',
    'Cart',
    'ForumPost',
    'ForumComment',
    'Rating',
    'Testimonial',
    'PrepaidCard'
  ];

  for (const modelName of models) {
    const Model = require(`../../models/${modelName}`);
    await Model.deleteMany({});
  }
};

/**
 * Créer un mock request Express
 */
const createMockRequest = (options = {}) => {
  return {
    body: options.body || {},
    params: options.params || {},
    query: options.query || {},
    headers: options.headers || {},
    user: options.user || null,
    file: options.file || null,
    files: options.files || null,
    ...options
  };
};

/**
 * Créer un mock response Express
 */
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Créer un mock next function
 */
const createMockNext = () => {
  return jest.fn();
};

module.exports = {
  generateTestToken,
  createTestUser,
  cleanDatabase,
  createMockRequest,
  createMockResponse,
  createMockNext
};

