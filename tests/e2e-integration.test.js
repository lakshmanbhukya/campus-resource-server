const request = require('supertest');
const app = require('./testApp');

describe('Simple E2E Tests', () => {
  it('should handle basic resource sharing flow', async () => {
    // Register two users
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'owner',
        email: 'owner@test.edu',
        password: 'password123'
      })
      .expect(201);

    await request(app)
      .post('/api/users/register')
      .send({
        username: 'borrower',
        email: 'borrower@test.edu',
        password: 'password123'
      })
      .expect(201);

    // Login both users
    const ownerLogin = await request(app)
      .post('/api/users/login')
      .send({
        email: 'owner@test.edu',
        password: 'password123'
      })
      .expect(200);

    const borrowerLogin = await request(app)
      .post('/api/users/login')
      .send({
        email: 'borrower@test.edu',
        password: 'password123'
      })
      .expect(200);

    const ownerToken = ownerLogin.body.token;
    const borrowerToken = borrowerLogin.body.token;

    // Owner adds a resource
    const resourceResponse = await request(app)
      .post('/api/resources/add')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Test Book',
        description: 'A test book for sharing',
        owner: 'owner'
      })
      .expect(201);

    const resourceId = resourceResponse.body.resource._id;

    // Borrower requests the resource
    const borrowRequest = await request(app)
      .post('/api/borrows/request')
      .set('Authorization', `Bearer ${borrowerToken}`)
      .send({
        resourceId,
        borrower: 'borrower',
        owner: 'owner'
      })
      .expect(201);

    // Owner approves the request
    await request(app)
      .put(`/api/borrows/update/${borrowRequest.body.request._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'Approved' })
      .expect(200);

    // Update resource status to borrowed
    await request(app)
      .put(`/api/resources/update-status/${resourceId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'Borrowed' })
      .expect(200);

    // Verify final state
    const allResources = await request(app)
      .get('/api/resources/all')
      .expect(200);

    const resource = allResources.body.find(r => r._id === resourceId);
    expect(resource.status).toBe('Borrowed');
  });

  it('should handle request rejection', async () => {
    // Register users
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'owner2',
        email: 'owner2@test.edu',
        password: 'password123'
      })
      .expect(201);

    await request(app)
      .post('/api/users/register')
      .send({
        username: 'borrower2',
        email: 'borrower2@test.edu',
        password: 'password123'
      })
      .expect(201);

    // Login users
    const ownerLogin = await request(app)
      .post('/api/users/login')
      .send({ email: 'owner2@test.edu', password: 'password123' })
      .expect(200);

    const borrowerLogin = await request(app)
      .post('/api/users/login')
      .send({ email: 'borrower2@test.edu', password: 'password123' })
      .expect(200);

    // Add resource
    const resourceResponse = await request(app)
      .post('/api/resources/add')
      .set('Authorization', `Bearer ${ownerLogin.body.token}`)
      .send({
        title: 'Rejection Test Book',
        description: 'A book for rejection testing',
        owner: 'owner2'
      })
      .expect(201);

    // Create borrow request
    const borrowRequest = await request(app)
      .post('/api/borrows/request')
      .set('Authorization', `Bearer ${borrowerLogin.body.token}`)
      .send({
        resourceId: resourceResponse.body.resource._id,
        borrower: 'borrower2',
        owner: 'owner2'
      })
      .expect(201);

    // Owner rejects the request
    await request(app)
      .put(`/api/borrows/update/${borrowRequest.body.request._id}`)
      .set('Authorization', `Bearer ${ownerLogin.body.token}`)
      .send({ status: 'Rejected' })
      .expect(200);

    // Verify request status
    const allRequests = await request(app)
      .get('/api/borrows/all')
      .set('Authorization', `Bearer ${ownerLogin.body.token}`)
      .expect(200);

    const request_obj = allRequests.body.find(r => r._id === borrowRequest.body.request._id);
    expect(request_obj.status).toBe('Rejected');
  });
});