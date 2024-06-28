const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password, role, class: studentClass, section, teachesClass, teachesSection, orgId } = req.body;

  try {
    const user = new User({ name, email, password, role, class: studentClass, section, teachesClass, teachesSection, orgId });
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
