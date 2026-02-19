const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const isValidEmail = (email = '') => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password = '') => {
  return typeof password === 'string' && password.length >= 6;
};

const allowedRoles = ['user', 'volunteer', 'admin'];

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Dashboard root route: GET /
router.get('/', (req, res) => {
  res.json({
    page: 'dashboard',
    message: 'Clean Street dashboard root',
  });
});

// Register route: POST /register
router.post('/register', async (req, res) => {
  try {
    const raw = req.body || {};
    const name = raw.name && String(raw.name).trim();
    const email = raw.email && String(raw.email).trim().toLowerCase();
    const password = raw.password;
    const location = raw.location && String(raw.location).trim();
    const role = raw.role && String(raw.role).trim();
    const profilePhoto = raw.profilePhoto && String(raw.profilePhoto).trim();

    const errors = {};

    if (!name) {
      errors.name = 'Name is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Email is not valid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (role && !allowedRoles.includes(role)) {
      errors.role = 'Role must be one of user, volunteer, admin';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      role: role && allowedRoles.includes(role) ? role : 'user',
      profilePhoto,
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Login route: POST /login
router.post('/login', async (req, res) => {
  try {
    const raw = req.body || {};
    const email = raw.email && String(raw.email).trim().toLowerCase();
    const password = raw.password;

    const errors = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Email is not valid';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Example protected route to verify JWT
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;

