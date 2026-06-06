const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt to verify passwords

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
        message: "User registered successfully! 🎉"
      });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    console.error(`Error in registration: ${error.message}`);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation: Ensure email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });

    // 3. Check if user exists AND password matches the database hash
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate a fresh JWT token for the session
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
        message: "Welcome back! Login successful. 🔑"
      });
    } else {
      // Security tip: Use a generic message so hackers don't know if the email or password was wrong
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(`Error in login: ${error.message}`);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Export both functions
module.exports = { registerUser, loginUser };