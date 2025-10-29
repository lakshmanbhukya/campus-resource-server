const request = require('supertest');
const app = require('./testApp');

describe('Basic Integration Tests', () => {
  it('should complete basic user flow', async () => {
    // Register user
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'integrationuser',
        email: 'integration@example.com',
        password: 'password123'
      })
      .expect(201);

    // Login user
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'integration@example.com',
        password: 'password123'
      })
      .expect(200);

    const authToken = loginResponse.body.token;
    expect(authToken).toBeDefined();

    // Add resource
    const resourceResponse = await request(app)
      .post('/api/resources/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Book',
        description: 'A test book',
        owner: 'integrationuser'
      })
      .expect(201);

    const resourceId = resourceResponse.body.resource._id;

    // Get all resources
    await request(app)
      .get('/api/resources/all')
      .expect(200);

    // Create borrow request
    const borrowResponse = await request(app)
      .post('/api/borrows/request')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        resourceId,
        borrower: 'borrower1',
        owner: 'integrationuser'
      })
      .expect(201);

    // Update borrow status
    await request(app)
      .put(`/api/borrows/update/${borrowResponse.body.request._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'Approved' })
      .expect(200);

    // Check health
    await request(app)
      .get('/health')
      .expect(200);
  });
});