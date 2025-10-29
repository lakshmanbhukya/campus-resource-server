const request = require('supertest');
const app = require('./testApp');

describe('Simple API Tests', () => {
  describe('Basic Routes', () => {
    it('should return 200 for root endpoint', async () => {
      await request(app).get('/').expect(200);
    });

    it('should return 404 for non-existent routes', async () => {
      await request(app).get('/non-existent-route').expect(404);
    });

    it('should return 200 for health check', async () => {
      await request(app).get('/health').expect(200);
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app).get('/').expect(200);
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('Authentication Flow', () => {
    it('should handle complete auth flow', async () => {
      // Register
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'authuser',
          email: 'auth@example.com',
          password: 'password123'
        })
        .expect(201);

      // Login
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          email: 'auth@example.com',
          password: 'password123'
        })
        .expect(200);

      const token = loginResponse.body.token;
      expect(token).toBeDefined();

      // Use token for authenticated request
      await request(app)
        .post('/api/resources/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Auth Test Book',
          description: 'A book for auth testing',
          owner: 'authuser'
        })
        .expect(201);
    });

    it('should return 403 for expired token', async () => {
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { id: 'user123', username: 'testuser' },
        process.env.JWT_SECRET || 'campusappsecret',
        { expiresIn: '-1h' }
      );

      await request(app)
        .post('/api/resources/add')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send({
          title: 'Test Book',
          description: 'Test description',
          owner: 'testuser'
        })
        .expect(403);
    });
  });
});