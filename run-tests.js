#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Campus Resource Server Test Suite');
console.log('=====================================\n');

// Check if dependencies are installed
const packageJsonPath = path.join(__dirname, 'package.json');
const nodeModulesPath = path.join(__dirname, 'node_modules');

if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

// Test categories
const testCategories = {
  unit: {
    name: 'Unit Tests',
    description: 'Testing individual components (models, middleware)',
    command: 'npm run test:unit'
  },
  routes: {
    name: 'Route Tests',
    description: 'Testing API endpoints and route handlers',
    command: 'npm run test:routes'
  },
  integration: {
    name: 'Integration Tests',
    description: 'Testing component interactions and workflows',
    command: 'npm run test:integration'
  },
  api: {
    name: 'API Integration Tests',
    description: 'Testing API behavior, CORS, authentication flow',
    command: 'npm run test:api'
  },
  e2e: {
    name: 'End-to-End Tests',
    description: 'Testing complete user scenarios and workflows',
    command: 'npm run test:e2e'
  },
  all: {
    name: 'All Tests',
    description: 'Running complete test suite',
    command: 'npm test'
  },
  coverage: {
    name: 'Coverage Report',
    description: 'Running tests with coverage analysis',
    command: 'npm run test:coverage'
  }
};

// Get command line argument
const testType = process.argv[2] || 'all';

if (!testCategories[testType]) {
  console.log('❌ Invalid test type. Available options:');
  Object.keys(testCategories).forEach(key => {
    console.log(`   ${key}: ${testCategories[key].description}`);
  });
  console.log('\nUsage: node run-tests.js [test-type]');
  console.log('Example: node run-tests.js unit');
  process.exit(1);
}

const selectedTest = testCategories[testType];

console.log(`🧪 Running ${selectedTest.name}`);
console.log(`📝 ${selectedTest.description}\n`);

try {
  const startTime = Date.now();
  execSync(selectedTest.command, { stdio: 'inherit' });
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`\n✅ ${selectedTest.name} completed successfully in ${duration}s`);
  
  if (testType === 'coverage') {
    console.log('\n📊 Coverage report generated in coverage/ directory');
    console.log('💡 Open coverage/lcov-report/index.html in your browser to view detailed coverage');
  }
  
} catch (error) {
  console.error(`\n❌ ${selectedTest.name} failed`);
  console.error('Error details:', error.message);
  process.exit(1);
}

// Additional information
console.log('\n📚 Available Test Commands:');
console.log('==========================');
Object.keys(testCategories).forEach(key => {
  console.log(`${key.padEnd(12)} - ${testCategories[key].description}`);
});

console.log('\n🔧 Development Commands:');
console.log('========================');
console.log('npm run test:watch   - Run tests in watch mode');
console.log('npm run test:verbose - Run tests with detailed output');
console.log('npm run test:silent  - Run tests with minimal output');

console.log('\n🎯 Quick Start:');
console.log('===============');
console.log('node run-tests.js unit        - Test models and middleware');
console.log('node run-tests.js routes      - Test API endpoints');
console.log('node run-tests.js integration - Test component interactions');
console.log('node run-tests.js e2e         - Test complete user scenarios');
console.log('node run-tests.js coverage    - Generate coverage report');
console.log('node run-tests.js all         - Run all tests');