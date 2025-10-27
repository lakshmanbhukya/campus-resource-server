#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Test Setup');
console.log('========================\n');

const checks = [
  {
    name: 'Jest Configuration',
    check: () => fs.existsSync(path.join(__dirname, 'jest.config.js')),
    message: 'jest.config.js exists'
  },
  {
    name: 'Test Directory',
    check: () => fs.existsSync(path.join(__dirname, 'tests')),
    message: 'tests/ directory exists'
  },
  {
    name: 'Test Setup File',
    check: () => fs.existsSync(path.join(__dirname, 'tests', 'setup.js')),
    message: 'tests/setup.js exists'
  },
  {
    name: 'Test App File',
    check: () => fs.existsSync(path.join(__dirname, 'tests', 'testApp.js')),
    message: 'tests/testApp.js exists'
  },
  {
    name: 'Package.json Test Scripts',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
      return packageJson.scripts && packageJson.scripts.test;
    },
    message: 'package.json has test scripts'
  },
  {
    name: 'Jest Dependency',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
      return packageJson.devDependencies && packageJson.devDependencies.jest;
    },
    message: 'Jest is listed in devDependencies'
  },
  {
    name: 'Supertest Dependency',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
      return packageJson.devDependencies && packageJson.devDependencies.supertest;
    },
    message: 'Supertest is listed in devDependencies'
  },
  {
    name: 'MongoDB Memory Server',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
      return packageJson.devDependencies && packageJson.devDependencies['mongodb-memory-server'];
    },
    message: 'MongoDB Memory Server is listed in devDependencies'
  }
];

// Count test files
const testFiles = [
  'models.test.js',
  'auth.test.js',
  'userRoutes.test.js',
  'resourceRoutes.test.js',
  'borrowRoutes.test.js',
  'healthRoutes.test.js',
  'integration.test.js',
  'integration-advanced.test.js',
  'api-integration.test.js',
  'e2e-integration.test.js'
];

let passedChecks = 0;
let totalChecks = checks.length;

// Run basic checks
checks.forEach(check => {
  try {
    if (check.check()) {
      console.log(`✅ ${check.message}`);
      passedChecks++;
    } else {
      console.log(`❌ ${check.message}`);
    }
  } catch (error) {
    console.log(`❌ ${check.message} - Error: ${error.message}`);
  }
});

// Check test files
console.log('\n📁 Test Files:');
let existingTestFiles = 0;
testFiles.forEach(file => {
  const filePath = path.join(__dirname, 'tests', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
    existingTestFiles++;
  } else {
    console.log(`❌ ${file}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`Basic Setup: ${passedChecks}/${totalChecks} checks passed`);
console.log(`Test Files: ${existingTestFiles}/${testFiles.length} files found`);

if (passedChecks === totalChecks && existingTestFiles === testFiles.length) {
  console.log('\n🎉 All checks passed! Your test setup is ready.');
  console.log('\n🚀 Next steps:');
  console.log('1. Install dependencies: npm install');
  console.log('2. Run tests: npm test');
  console.log('3. Generate coverage: npm run test:coverage');
  console.log('4. Use test runner: node run-tests.js [category]');
} else {
  console.log('\n⚠️  Some checks failed. Please review the setup.');
  console.log('\n🔧 To fix issues:');
  console.log('1. Ensure all test files are created');
  console.log('2. Check package.json dependencies');
  console.log('3. Verify jest.config.js exists');
  console.log('4. Run: npm install');
}

console.log('\n📚 Available Commands:');
console.log('npm test                 - Run all tests');
console.log('npm run test:unit        - Run unit tests');
console.log('npm run test:routes      - Run route tests');
console.log('npm run test:integration - Run integration tests');
console.log('npm run test:e2e         - Run end-to-end tests');
console.log('npm run test:coverage    - Generate coverage report');
console.log('node run-tests.js [type] - Use custom test runner');