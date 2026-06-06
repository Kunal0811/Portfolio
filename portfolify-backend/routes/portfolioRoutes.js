const express = require('express');
const router = express.Router();
const { uploadResume, getUserPortfolio } = require('../controllers/portfolioController');

const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/me', protect, getUserPortfolio); // <-- The new GET route

module.exports = router;