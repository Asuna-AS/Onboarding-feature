const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Register User
router.post('/register', upload.single('image') ,async (req, res) => {
  const { name, email, password, role, class_, section, teachesClass, teachesSection, orgId } = req.body;
  console.log(password)
  const image = req.file ? req.file.path : '';
  try {
    const user = new User({ name, email, password, role, class_, section, teachesClass, teachesSection, orgId, image });
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    let additionalData = {};
    if (user.role === 'teacher') {
      additionalData = await User.find({
        role: 'student',
        class_: user.teachesClass,
        section: user.teachesSection,
        orgId: user.orgId
      }).select('-password');
    }

    res.json({ success: true, token, user, additionalData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});




module.exports = router;
