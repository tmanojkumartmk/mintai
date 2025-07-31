const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Auth routes
router.post('/register', authController.register.bind(authController));
router.post('/otp/verify', authController.verifyOTP.bind(authController));
router.post('/login', authController.login.bind(authController));

module.exports = router;
