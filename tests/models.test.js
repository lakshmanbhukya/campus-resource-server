const User = require('../models/User');
const Resource = require('../models/Resource');

describe('Simple Model Tests', () => {
  describe('User Model', () => {
    it('should create valid user', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword'
      });

      const savedUser = await user.save();
      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe('testuser');
    });

    it('should reject user without required fields', async () => {
      const user = new User({ username: 'testuser' });
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('Resource Model', () => {
    it('should create valid resource', async () => {
      const resource = new Resource({
        title: 'Test Book',
        description: 'A test book',
        owner: 'testuser'
      });

      const savedResource = await resource.save();
      expect(savedResource._id).toBeDefined();
      expect(savedResource.status).toBe('Available');
    });

    it('should reject resource without required fields', async () => {
      const resource = new Resource({ title: 'Test Book' });
      await expect(resource.save()).rejects.toThrow();
    });

    it('should reject invalid status', async () => {
      const resource = new Resource({
        title: 'Test Book',
        description: 'A test book',
        owner: 'testuser',
        status: 'InvalidStatus'
      });

      await expect(resource.save()).rejects.toThrow();
    });
  });
});