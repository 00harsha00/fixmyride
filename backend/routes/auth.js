const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateFields = (fields, res) => {
  for (const [field, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      res.status(400).json({ msg: `${field} is required` });
      return false;
    }
  }
  return true;
};

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!validateFields({ username, email, password }, res)) return;

  try {
    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return user data (excluding password) and token
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.json({ user: userResponse, token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // Validate required fields
  if (!validateFields({ usernameOrEmail, password }, res)) return;

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return user data (excluding password) and token
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.json({ user: userResponse, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;