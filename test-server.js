// Quick test to verify server configuration
try {
  console.log('Testing server configuration...');
  
  // Test require statements
  const express = require('express');
  const cors = require('cors');
  const mongoose = require('mongoose');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  
  console.log('✅ All dependencies loaded successfully');
  
  // Test model imports
  const User = require('./models/User');
  const Resource = require('./models/Resource');
  const Borrow = require('./models/Borrow');
  
  console.log('✅ All models loaded successfully');
  
  // Test route imports
  const userRoutes = require('./routes/userRoutes');
  const resourceRoutes = require('./routes/resourceRoutes');
  const borrowRoutes = require('./routes/borrowRoutes');
  
  console.log('✅ All routes loaded successfully');
  console.log('✅ Server configuration is valid!');
  
} catch (error) {
  console.error('❌ Configuration error:', error.message);
  process.exit(1);
}