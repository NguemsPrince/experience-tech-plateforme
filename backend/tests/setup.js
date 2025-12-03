// Setup pour les tests Jest
require('dotenv').config({ path: '.env.test' });

// Mock MongoDB connection
jest.mock('../config/database', () => ({
  connectDB: jest.fn(() => Promise.resolve())
}));

// Setup des variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
process.env.MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/experience_tech_test';

// Augmenter le timeout pour les tests de base de données
jest.setTimeout(10000);

// Nettoyer après chaque test
afterEach(() => {
  jest.clearAllMocks();
});

