require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db'); // Initialize MongoDB connection
const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Debug middleware
app.use((req, res, next) => {
  console.log(`🔍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' }));

// CORS configuration for development and production
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? '*'
    : allowedOrigins
}));

app.use(express.static('public'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/health', healthRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Campus Resource Server is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      resources: '/api/resources', 
      borrows: '/api/borrows'
    }
  });
});

// Health check routes
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.json(healthData);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Simple health check for load balancers
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`⚠️  404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log('✅ Server is ready to accept connections');
});