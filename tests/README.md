# Campus Resource Server Tests

## Overview
Simplified test suite focusing on basic functionality and status code validation.

## Test Files

### Unit Tests
- `auth.test.js` - Authentication middleware tests
- `userRoutes.test.js` - User registration and login tests  
- `resourceRoutes.test.js` - Resource CRUD operation tests
- `borrowRoutes.test.js` - Borrow request management tests
- `healthRoutes.test.js` - Health check endpoint tests
- `models.test.js` - Database model validation tests

### Integration Tests
- `integration.test.js` - Basic user flow integration
- `api-integration.test.js` - API endpoint integration
- `e2e-integration.test.js` - End-to-end scenarios

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test auth.test.js
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Simple Test Runner
```bash
node tests/run-tests.js
```

## Test Focus Areas

### Status Code Validation ✅
- 200 - Success responses
- 201 - Resource creation
- 400 - Bad requests
- 401 - Unauthorized access
- 403 - Forbidden (expired tokens)
- 404 - Not found
- 500 - Server errors

### Basic Functionality ✅
- User registration and login
- JWT token validation
- Resource CRUD operations
- Borrow request workflow
- Health check endpoints

### What's NOT Tested (Simplified)
- Complex edge cases
- Performance testing
- Load testing
- Advanced error scenarios
- Detailed validation messages

## Test Database
Tests use MongoDB Memory Server for isolated testing environment.

## Key Testing Principles
1. **Simple & Clear** - Easy to understand test cases
2. **Status Code Focus** - Validate HTTP responses
3. **Basic Flows** - Test core functionality
4. **Minimal Setup** - Reduced complexity
5. **Fast Execution** - Quick feedback loop