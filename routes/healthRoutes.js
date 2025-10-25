const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resource = require('../models/Resource');
const Borrow = require('../models/Borrow');

// Detailed health check with database stats
router.get('/detailed', async (req, res) => {
  try {
    const [userCount, resourceCount, borrowCount] = await Promise.all([
      User.countDocuments(),
      Resource.countDocuments(),
      Borrow.countDocuments()
    ]);

    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        collections: {
          users: userCount,
          resources: resourceCount,
          borrows: borrowCount
        }
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;