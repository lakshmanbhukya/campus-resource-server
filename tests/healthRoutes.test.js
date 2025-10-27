const request = require('supertest');
const app = require('./testApp');

describe('Health Routes', () => {
  describe('GET /health', () => {
    it('should return 200 and status OK', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
    });
  });

  describe('GET /api/health/detailed', () => {
    it('should return 200 and detailed health info', async () => {
      const response = await request(app)
        .get('/api/health/detailed')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.database).toBeDefined();
      expect(response.body.server).toBeDefined();
    });
  });
});