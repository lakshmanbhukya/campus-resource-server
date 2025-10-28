// Debug script to test server components
console.log('🔍 Starting Campus Resource Server Debug...\n');

async function debugServer() {
  try {
    // Test 1: Check dependencies
    console.log('1️⃣ Testing dependencies...');
    const express = require('express');
    const cors = require('cors');
    const mongoose = require('mongoose');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    console.log('✅ All dependencies loaded\n');

    // Test 2: Check database connection
    console.log('2️⃣ Testing database connection...');
    require('./db');
    
    // Wait for connection
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
      
      mongoose.connection.on('connected', () => {
        clearTimeout(timeout);
        console.log('✅ Database connected successfully\n');
        resolve();
      });
      
      mongoose.connection.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    // Test 3: Check models
    console.log('3️⃣ Testing models...');
    const User = require('./models/User');
    const Resource = require('./models/Resource');
    const Borrow = require('./models/Borrow');
    console.log('✅ All models loaded successfully\n');

    // Test 4: Check routes
    console.log('4️⃣ Testing routes...');
    const userRoutes = require('./routes/userRoutes');
    const resourceRoutes = require('./routes/resourceRoutes');
    const borrowRoutes = require('./routes/borrowRoutes');
    console.log('✅ All routes loaded successfully\n');

    // Test 5: Test database operations
    console.log('5️⃣ Testing database operations...');
    
    // Count existing documents
    const userCount = await User.countDocuments();
    const resourceCount = await Resource.countDocuments();
    const borrowCount = await Borrow.countDocuments();
    
    console.log('📊 Database Statistics:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Resources: ${resourceCount}`);
    console.log(`   Borrow Requests: ${borrowCount}`);
    console.log('✅ Database operations working\n');

    console.log('🎉 All tests passed! Server is ready to run.');
    console.log('💡 Run "npm start" to start the server');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('🔧 Please fix the above error before starting the server');
  } finally {
    process.exit(0);
  }
}

debugServer();