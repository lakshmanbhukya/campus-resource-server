const express = require('express');
const cors = require('cors');

// Import routes
const userRoutes = require('../routes/userRoutes');
const resourceRoutes = require('../routes/resourceRoutes');
const borrowRoutes = require('../routes/borrowRoutes');
const healthRoutes = require('../routes/healthRoutes');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: '*' }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/health', healthRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Campus Resource Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', async (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: err.message
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;