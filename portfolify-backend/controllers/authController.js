const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Auto-generate a username slug from name
const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) + Math.floor(Math.random() * 1000);

const registerUser = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Please fill in all fields" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "A user with this email already exists" });

    // Handle username: use provided or auto-generate
    let finalUsername = username?.trim().toLowerCase() || slugify(name);
    const usernameExists = await User.findOne({ username: finalUsername });
    if (usernameExists) finalUsername = slugify(name); // fallback with random suffix

    const user = await User.create({ name, email, password, username: finalUsername });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        token: generateToken(user._id),
        message: "User registered successfully! 🎉"
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please provide email and password" });

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        token: generateToken(user._id),
        message: "Login successful 🔑"
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Server error during login" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, username } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (username) {
      const exists = await User.findOne({ username: username.toLowerCase(), _id: { $ne: req.user._id } });
      if (exists) return res.status(400).json({ message: "Username already taken" });
      updates.username = username.toLowerCase();
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ user, message: "Profile updated!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, updateProfile };