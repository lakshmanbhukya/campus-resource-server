const { execSync } = require('child_process');

console.log('🚀 Installing test dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('\n🧪 Running tests...');
try {
  execSync('npm test', { stdio: 'inherit' });
  console.log('✅ All tests completed');
} catch (error) {
  console.error('❌ Tests failed:', error.message);
  process.exit(1);
}