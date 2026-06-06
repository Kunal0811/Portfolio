const express = require('express');
const router = express.Router();
const { uploadResume, getUserPortfolio, getPortfolioByUserId } = require('../controllers/portfolioController');

const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/me', protect, getUserPortfolio);

// NEW: Public route to view a specific portfolio
router.get('/user/:userId', getPortfolioByUserId); 

module.exports = router;