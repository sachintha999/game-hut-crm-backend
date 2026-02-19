const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/login
// Body: { email, password }
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res
        .status(500)
        .json({ message: 'JWT_SECRET is not configured on the server' });
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
};
