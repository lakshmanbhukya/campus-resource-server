const mongoose = require('../db');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Available', 'Borrowed', 'Unavailable'],
    default: 'Available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
