const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/profile', protect, updateProfile);

module.exports = router;