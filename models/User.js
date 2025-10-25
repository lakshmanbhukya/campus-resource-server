const mongoose = require('../db');

// Define User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,  // ensures no duplicate emails
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {           // optional: store registration date
    type: Date,
    default: Date.now
  }
});

// Export User model
module.exports = mongoose.model('User', userSchema);