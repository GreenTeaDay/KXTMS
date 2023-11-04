// routes/users.js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Validate request body
    if (!username || !password || !email) {
      return res.status(400).send({ error: 'Username, password, and email are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    
    console.log('Signing token with secret:', process.env.JWT_SECRET); // Log the JWT secret for debugging
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (e) {
    console.error('Registration error:', e);
    res.status(400).send({ error: e.message || 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
    }

    console.log('Signing token with secret:', process.env.JWT_SECRET); // Log the JWT secret for debugging
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (e) {
    console.error('Login error:', e);
    res.status(400).send({ error: 'Failed to login' });
  }
});

// Add other user-related routes as needed

router.post('/test', auth, (req, res) => { // I've added auth middleware to protect this route
  res.status(200).send('Test route is working and is authenticated!');
});

module.exports = router;
