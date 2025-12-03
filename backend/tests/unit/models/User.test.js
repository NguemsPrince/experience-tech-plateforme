const User = require('../../../models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  describe('Schema Validation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123456!',
        firstName: 'Test',
        lastName: 'User',
        role: 'client'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.isActive).toBe(true);
    });

    it('should require email field', async () => {
      const user = new User({
        password: 'Test123456!',
        firstName: 'Test',
        lastName: 'User'
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require password field', async () => {
      const user = new User({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const user = new User({
        email: 'invalid-email',
        password: 'Test123456!',
        firstName: 'Test',
        lastName: 'User'
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should hash password before saving', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123456!',
        firstName: 'Test',
        lastName: 'User'
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe(userData.password);
      expect(user.password.length).toBeGreaterThan(20);
    });
  });

  describe('Instance Methods', () => {
    it('should compare password correctly', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123456!',
        firstName: 'Test',
        lastName: 'User'
      };

      const user = new User(userData);
      await user.save();

      const isMatch = await user.comparePassword('Test123456!');
      expect(isMatch).toBe(true);

      const isWrongMatch = await user.comparePassword('WrongPassword');
      expect(isWrongMatch).toBe(false);
    });
  });

  describe('Virtual Fields', () => {
    it('should return full name', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'Test123456!',
        firstName: 'John',
        lastName: 'Doe'
      });

      expect(user.fullName).toBe('John Doe');
    });
  });
});

