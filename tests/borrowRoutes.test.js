const request = require('supertest');
const app = require('./testApp');

describe('Borrow Routes', () => {
  let authToken;
  let resourceId;

  beforeEach(async () => {
    // Register and login user
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'borrowuser',
        email: 'borrow@example.com',
        password: 'password123'
      });
    
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'borrow@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;

    // Create a resource
    const resourceResponse = await request(app)
      .post('/api/resources/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Borrow Test Book',
        description: 'A book for borrow testing',
        owner: 'borrowuser'
      });
    
    resourceId = resourceResponse.body.resource._id;
  });

  describe('POST /api/borrows/request', () => {
    it('should return 201 for valid borrow request', async () => {
      await request(app)
        .post('/api/borrows/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          resourceId,
          borrower: 'borrowuser',
          owner: 'borrowuser'
        })
        .expect(201);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .post('/api/borrows/request')
        .send({
          resourceId,
          borrower: 'borrowuser',
          owner: 'borrowuser'
        })
        .expect(401);
    });

    it('should return 400 for missing fields', async () => {
      await request(app)
        .post('/api/borrows/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ resourceId })
        .expect(400);
    });
  });

  describe('GET /api/borrows/all', () => {
    it('should return 200 with token', async () => {
      const response = await request(app)
        .get('/api/borrows/all')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/borrows/all')
        .expect(401);
    });
  });

  describe('PUT /api/borrows/update/:id', () => {
    let borrowId;

    beforeEach(async () => {
      const borrowResponse = await request(app)
        .post('/api/borrows/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          resourceId,
          borrower: 'borrowuser',
          owner: 'borrowuser'
        });
      
      borrowId = borrowResponse.body.request._id;
    });

    it('should return 200 for valid status update', async () => {
      await request(app)
        .put(`/api/borrows/update/${borrowId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'Approved' })
        .expect(200);
    });

    it('should return 400 for invalid status', async () => {
      await request(app)
        .put(`/api/borrows/update/${borrowId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'InvalidStatus' })
        .expect(400);
    });
  });
});