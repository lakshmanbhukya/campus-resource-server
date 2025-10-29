const request = require('supertest');
const app = require('./testApp');

describe('User Routes', () => {
  describe('POST /api/users/register', () => {
    it('should return 201 for valid registration', async () => {
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(201);
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'duplicate@example.com',
        password: 'password123'
      };
      
      await request(app).post('/api/users/register').send(userData);
      await request(app).post('/api/users/register').send(userData).expect(400);
    });

    it('should return 500 for missing fields', async () => {
      await request(app)
        .post('/api/users/register')
        .send({ username: 'testuser' })
        .expect(500);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'loginuser',
          email: 'login@example.com',
          password: 'password123'
        });
    });

    it('should return 200 for valid login', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        })
        .expect(200);
      
      expect(response.body.token).toBeDefined();
    });

    it('should return 400 for wrong password', async () => {
      await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        })
        .expect(400);
    });

    it('should return 400 for non-existent user', async () => {
      await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(400);
    });
  });
});