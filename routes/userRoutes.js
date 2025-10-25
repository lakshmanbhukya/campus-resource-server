// backend/routes/userroutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ---------------- REGISTER ----------------
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save(); // ✅ Store user in DB

    res.status(201).json({ message: 'Registration Successful' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'campusappsecret',
      { expiresIn: '24h' }
    );

    // Send token and username to frontend
    res.status(200).json({ message: 'Login Successful', token, username: user.username });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;