const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Store for mock OTP
const otpStore = new Map();

class AuthController {
  async register(req, res) {
    try {
      const { email, password, phoneNumber } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.create({
        email,
        password: hashedPassword,
        phoneNumber
      });

      const mockOTP = Math.floor(100000 + Math.random() * 900000);
      otpStore.set(phoneNumber, mockOTP);
      console.log(`[Mock OTP] Generated for ${phoneNumber}: ${mockOTP}`);

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          subscriptionTier: user.subscriptionTier
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async verifyOTP(req, res) {
    try {
      const { phoneNumber, otp } = req.body;

      if (!phoneNumber || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
      }

      const storedOTP = otpStore.get(phoneNumber);
      if (!storedOTP) {
        return res.status(400).json({ error: 'No OTP found for this phone number' });
      }

      if (storedOTP.toString() !== otp.toString()) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      const user = await User.findOne({ where: { phoneNumber } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const token = this.generateToken(user);
      otpStore.delete(phoneNumber);

      res.json({
        message: 'OTP verified successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          subscriptionTier: user.subscriptionTier
        }
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = this.generateToken(user);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          subscriptionTier: user.subscriptionTier
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  generateToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

module.exports = new AuthController();
