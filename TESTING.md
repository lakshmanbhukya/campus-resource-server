# Campus Resource Server - Testing Guide

This document provides comprehensive information about testing the Campus Resource Server application.

## 🧪 Test Suite Overview

The test suite includes multiple types of tests to ensure code quality, functionality, and reliability:

### Test Categories

1. **Unit Tests** (`tests/models.test.js`, `tests/auth.test.js`)
   - Test individual components in isolation
   - Models validation and schema testing
   - Middleware functionality testing

2. **Route Tests** (`tests/*Routes.test.js`)
   - Test API endpoints and route handlers
   - Authentication and authorization testing
   - Request/response validation

3. **Integration Tests** (`tests/integration*.test.js`)
   - Test component interactions
   - Multi-user workflows
   - Data consistency testing
   - Error handling and recovery

4. **API Integration Tests** (`tests/api-integration.test.js`)
   - CORS and headers testing
   - Content-type handling
   - Authentication flow testing
   - Performance under load

5. **End-to-End Tests** (`tests/e2e-integration.test.js`)
   - Complete user scenarios
   - Real-world workflow simulation
   - System health monitoring

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
# or
node run-tests.js all
```

### Run Specific Test Categories
```bash
# Unit tests only
npm run test:unit
# or
node run-tests.js unit

# Route tests only
npm run test:routes
# or
node run-tests.js routes

# Integration tests only
npm run test:integration
# or
node run-tests.js integration

# End-to-end tests only
npm run test:e2e
# or
node run-tests.js e2e

# API integration tests only
npm run test:api
# or
node run-tests.js api
```

### Generate Coverage Report
```bash
npm run test:coverage
# or
node run-tests.js coverage
```

### Development Testing
```bash
# Watch mode - reruns tests on file changes
npm run test:watch

# Verbose output - detailed test information
npm run test:verbose

# Silent mode - minimal output
npm run test:silent
```

## 📁 Test Structure

```
tests/
├── setup.js                    # Test environment setup
├── testApp.js                  # Test application instance
├── models.test.js              # Model unit tests
├── auth.test.js                # Authentication middleware tests
├── userRoutes.test.js          # User routes tests
├── resourceRoutes.test.js      # Resource routes tests
├── borrowRoutes.test.js        # Borrow routes tests
├── healthRoutes.test.js        # Health check routes tests
├── integration.test.js         # Basic integration tests
├── integration-advanced.test.js # Advanced integration scenarios
├── api-integration.test.js     # API-level integration tests
└── e2e-integration.test.js     # End-to-end user scenarios
```

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
- **Test Environment**: Node.js
- **Test Timeout**: 30 seconds
- **Setup Files**: `tests/setup.js`
- **Coverage Collection**: Routes, models, middleware

### Test Database
- Uses MongoDB Memory Server for isolated testing
- Fresh database for each test suite
- Automatic cleanup after each test

## 📊 Test Scenarios Covered

### User Management
- ✅ User registration with validation
- ✅ User login with JWT token generation
- ✅ Duplicate email prevention
- ✅ Password hashing verification

### Resource Management
- ✅ Resource creation with authentication
- ✅ Resource listing (public endpoint)
- ✅ Resource status updates
- ✅ Input validation and error handling

### Borrow System
- ✅ Borrow request creation
- ✅ Duplicate request prevention
- ✅ Request status management
- ✅ Multi-user workflow testing

### Authentication & Authorization
- ✅ JWT token validation
- ✅ Protected route access control
- ✅ Token expiration handling
- ✅ Invalid token rejection

### Integration Scenarios
- ✅ Complete user journey (register → login → add resource → borrow → return)
- ✅ Multi-user resource sharing
- ✅ Conflict resolution (multiple requests for same resource)
- ✅ Equipment sharing workflows
- ✅ Error recovery and data consistency

### System Health
- ✅ Health check endpoints
- ✅ Database connectivity testing
- ✅ Performance under concurrent load
- ✅ CORS and header validation

## 🎯 Test Data Examples

### Sample User Data
```javascript
{
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
}
```

### Sample Resource Data
```javascript
{
  title: 'Advanced JavaScript Book',
  description: 'A comprehensive guide to JavaScript',
  owner: 'testuser'
}
```

### Sample Borrow Request
```javascript
{
  resourceId: '507f1f77bcf86cd799439011',
  borrower: 'student1',
  owner: 'teacher1'
}
```

## 🐛 Debugging Tests

### Running Individual Test Files
```bash
# Run specific test file
npx jest tests/userRoutes.test.js

# Run with verbose output
npx jest tests/userRoutes.test.js --verbose

# Run specific test case
npx jest -t "should register a new user successfully"
```

### Common Issues and Solutions

1. **MongoDB Connection Issues**
   - Ensure MongoDB Memory Server is properly installed
   - Check if port 27017 is available
   - Verify test setup in `tests/setup.js`

2. **Authentication Token Issues**
   - Check JWT_SECRET environment variable
   - Verify token generation in test setup
   - Ensure proper Authorization header format

3. **Test Timeout Issues**
   - Increase timeout in `jest.config.js`
   - Check for hanging database connections
   - Verify proper cleanup in test teardown

## 📈 Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## 🔄 Continuous Integration

The test suite is designed to run in CI/CD environments:

```bash
# CI-friendly test command
npm test -- --ci --coverage --watchAll=false
```

## 📝 Writing New Tests

### Test File Naming Convention
- Unit tests: `*.test.js`
- Integration tests: `*integration*.test.js`
- Route tests: `*Routes.test.js`

### Test Structure Template
```javascript
const request = require('supertest');
const app = require('./testApp');

describe('Feature Name', () => {
  beforeEach(async () => {
    // Setup test data
  });

  afterEach(async () => {
    // Cleanup if needed
  });

  describe('Specific Functionality', () => {
    it('should do something specific', async () => {
      // Test implementation
      const response = await request(app)
        .post('/api/endpoint')
        .send(testData)
        .expect(200);

      expect(response.body).toHaveProperty('expectedProperty');
    });
  });
});
```

## 🎉 Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Use clear, descriptive test names
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Use mocks for external services
5. **Test Edge Cases**: Include error scenarios and edge cases
6. **Keep Tests Fast**: Optimize for quick execution
7. **Regular Maintenance**: Update tests when code changes

## 📞 Support

If you encounter issues with tests:
1. Check this documentation
2. Review test logs for specific error messages
3. Ensure all dependencies are installed
4. Verify database connectivity
5. Check environment variables

Happy Testing! 🚀