require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection string with database name
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lakshmanbhukya:lakshmanbhukya@24505a0502.pdqtqlz.mongodb.net/campus-resource?retryWrites=true&w=majority&appName=24505a0502';

// Connection options
const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, options)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database: campus-resource');
    console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔴 MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = mongoose;
