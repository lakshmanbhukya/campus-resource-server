const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
require('dotenv').config();

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 401 without token', () => {
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return 403 with invalid token', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should call next() with valid token', () => {
    const token = jwt.sign(
      { id: 'user123', username: 'testuser' },
      process.env.JWT_SECRET || 'campusappsecret'
    );
    req.headers.authorization = `Bearer ${token}`;
    authenticateToken(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});