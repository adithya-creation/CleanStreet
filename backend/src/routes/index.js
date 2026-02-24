const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');

const router = express.Router();

const isValidEmail = (email = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password = '') => typeof password === 'string' && password.length >= 6;
const allowedRoles = ['user', 'volunteer', 'admin'];

const createToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// ─── Health check ─────────────────────────────────────────────
router.get('/', (req, res) => {
  res.json({ message: 'Clean Street API is running' });
});

// ─── Auth: Register ───────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location, role, profilePhoto } = req.body || {};
    const errors = {};
    if (!name?.trim()) errors.name = 'Name is required';
    if (!email?.trim()) errors.email = 'Email is required';
    else if (!isValidEmail(email)) errors.email = 'Email is not valid';
    if (!password) errors.password = 'Password is required';
    else if (!isValidPassword(password)) errors.password = 'Password must be at least 6 characters';
    if (role && !allowedRoles.includes(role)) errors.role = 'Invalid role';

    if (Object.keys(errors).length > 0)
      return res.status(400).json({ success: false, message: 'Validation failed', errors });

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing)
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      location: location?.trim(),
      role: allowedRoles.includes(role) ? role : 'user',
      profilePhoto: profilePhoto?.trim(),
    });

    const token = createToken(user);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── Auth: Login ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const errors = {};
    if (!email?.trim()) errors.email = 'Email is required';
    else if (!isValidEmail(email)) errors.email = 'Email is not valid';
    if (!password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0)
      return res.status(400).json({ success: false, message: 'Validation failed', errors });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = createToken(user);
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── Auth: Get current user ───────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email role location profilePhoto');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── Auth: Update profile ─────────────────────────────────────
router.patch('/me', auth, async (req, res) => {
  try {
    const { name, email, location } = req.body || {};
    const updates = {};
    if (name?.trim()) updates.name = name.trim();
    if (email?.trim()) {
      if (!isValidEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email' });
      // Check email not taken by someone else
      const existing = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: req.user.id } });
      if (existing) return res.status(409).json({ success: false, message: 'Email already in use' });
      updates.email = email.trim().toLowerCase();
    }
    if (location !== undefined) updates.location = location?.trim();

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('name email role location profilePhoto');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Return updated token so frontend stays in sync
    const token = createToken(user);
    return res.json({ success: true, message: 'Profile updated', user, token });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── Auth: Change password ────────────────────────────────────
router.patch('/me/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both passwords are required' });
    if (!isValidPassword(newPassword))
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── Complaints: Get all ─────────────────────────────────────
router.get('/complaints', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return res.json({ success: true, complaints });
  } catch (error) {
    console.error('Get complaints error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── Complaints: Get mine ─────────────────────────────────────
router.get('/complaints/mine', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, complaints });
  } catch (error) {
    console.error('Get my complaints error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── Complaints: Create ───────────────────────────────────────
router.post('/complaints', auth, async (req, res) => {
  try {
    const { title, description, address, locationCoords, photo, type, priority } = req.body || {};
    if (!title?.trim()) return res.status(400).json({ success: false, message: 'Title is required' });
    if (!description?.trim()) return res.status(400).json({ success: false, message: 'Description is required' });

    const complaint = await Complaint.create({
      user: req.user.id,
      title: title.trim(),
      description: description.trim(),
      address: address?.trim(),
      photo: photo?.trim(),
      locationCoords: locationCoords || undefined,
      status: 'received',
      priority: priority,
      type: type,
    });

    return res.status(201).json({ success: true, message: 'Complaint created', complaint });
  } catch (error) {
    console.error('Create complaint error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── Complaints: Get by ID ────────────────────────────────────
router.get('/complaints/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    return res.json({ success: true, complaint });
  } catch (error) {
    console.error('Get complaint error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ─── Complaints: Update status ────────────────────────────────
router.patch('/complaints/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body || {};
    const allowed = ['received', 'in_review', 'resolved'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    return res.json({ success: true, complaint });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
