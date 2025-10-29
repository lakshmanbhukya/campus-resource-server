#!/usr/bin/env node

// Simple test runner to run all tests
const { execSync } = require('child_process');

console.log('🧪 Running Campus Resource Server Tests...\n');

const testFiles = [
  'auth.test.js',
  'userRoutes.test.js', 
  'resourceRoutes.test.js',
  'borrowRoutes.test.js',
  'healthRoutes.test.js',
  'models.test.js',
  'integration.test.js',
  'api-integration.test.js',
  'e2e-integration.test.js'
];

let passedTests = 0;
let failedTests = 0;

testFiles.forEach(testFile => {
  try {
    console.log(`Running ${testFile}...`);
    execSync(`npm test -- ${testFile}`, { stdio: 'inherit' });
    console.log(`✅ ${testFile} passed\n`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${testFile} failed\n`);
    failedTests++;
  }
});

console.log('\n📊 Test Summary:');
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Total: ${passedTests + failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Check the output above.');
  process.exit(1);
}