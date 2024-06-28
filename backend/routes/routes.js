const express = require('express');
const { register, login, verifyUser } = require('../controllers/controller');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyUser);

module.exports = router;
