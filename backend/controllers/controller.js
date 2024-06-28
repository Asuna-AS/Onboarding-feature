const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { 
    name, 
    email, 
    password,
    role,
    verified,
    class_,
    section,
    orgId 
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role,
      verified,
      class_,
      section,
      orgId
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log("error:", error)
    res.status(500).json({ error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

exports.verifyUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { verified: true }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying user' });
  }
};
