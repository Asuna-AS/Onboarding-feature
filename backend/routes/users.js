const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');

// Get all users (protected route)
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
