const request = require('supertest');
const app = require('./testApp');

describe('Resource Routes', () => {
  let authToken;

  beforeEach(async () => {
    // Register and login to get token
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'resourceuser',
        email: 'resource@example.com',
        password: 'password123'
      });
    
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'resource@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;
  });

  describe('POST /api/resources/add', () => {
    it('should return 201 for valid resource', async () => {
      await request(app)
        .post('/api/resources/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Book',
          description: 'A test book',
          owner: 'resourceuser'
        })
        .expect(201);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .post('/api/resources/add')
        .send({
          title: 'Test Book',
          description: 'A test book',
          owner: 'resourceuser'
        })
        .expect(401);
    });

    it('should return 400 for missing fields', async () => {
      await request(app)
        .post('/api/resources/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Book' })
        .expect(400);
    });
  });

  describe('GET /api/resources/all', () => {
    it('should return 200 and array', async () => {
      const response = await request(app)
        .get('/api/resources/all')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /api/resources/update-status/:id', () => {
    let resourceId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/resources/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Update Test Book',
          description: 'A book for update testing',
          owner: 'resourceuser'
        });
      
      resourceId = response.body.resource._id;
    });

    it('should return 200 for valid status update', async () => {
      await request(app)
        .put(`/api/resources/update-status/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'Borrowed' })
        .expect(200);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .put(`/api/resources/update-status/${resourceId}`)
        .send({ status: 'Borrowed' })
        .expect(401);
    });

    it('should return 400 for invalid status', async () => {
      await request(app)
        .put(`/api/resources/update-status/${resourceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'InvalidStatus' })
        .expect(400);
    });
  });
});