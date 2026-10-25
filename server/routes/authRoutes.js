const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token with 7-day validity
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'student_secret_key_123', {
    expiresIn: '7d'
  });
};

// POST /api/auth/register - Register a new student
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, rollNumber, branch } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save student to database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      rollNumber: rollNumber || '',
      branch: branch || 'Computer Engineering'
    });

    // Return student info and token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      branch: user.branch,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login - Student login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    // Find student by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Return student info and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      branch: user.branch,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

module.exports = router;
