const express = require('express');

const router = express.Router();

// Dashboard root route: GET /
router.get('/', (req, res) => {
  res.json({
    page: 'dashboard',
    message: 'Clean Street dashboard root'
  });
});

// Login route: POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  // Placeholder response; plug in real auth later
  res.json({
    success: true,
    action: 'login',
    email,
  });
});

// Register route: POST /register
router.post('/register', (req, res) => {
  const { name, username, email, role } = req.body || {};

  // Placeholder response; plug in persistence later
  res.json({
    success: true,
    action: 'register',
    username,
    role: role || 'user',
  });
});

module.exports = router;

