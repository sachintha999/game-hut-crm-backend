const bcrypt = require('bcryptjs');
const User = require('../models/User');

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// POST /api/users
// Body: { email, password, role? }
const createAdmin = async (req, res) => {
  try {
    let { email, password, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    email = email.toLowerCase().trim();

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    if (role && role !== 'admin') {
      return res
        .status(400)
        .json({ message: 'Only admin users can be created from this endpoint' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: passwordHash,
      role: 'admin',
    });

    return res.status(201).json({
      message: 'Admin created successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAdmin,
};

