const express = require('express');
const router = express.Router();
const {
  uploadResume, regenerateBio, createManualPortfolio, updateTemplate,
  getUserPortfolio, getPortfolioByUserId, getPortfolioByUsername, getAnalytics
} = require('../controllers/portfolioController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Private routes
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/manual', protect, createManualPortfolio);
router.post('/regenerate-bio', protect, regenerateBio);
router.patch('/template', protect, updateTemplate);
router.get('/me', protect, getUserPortfolio);
router.get('/analytics', protect, getAnalytics);

// Public routes
router.get('/user/:userId', getPortfolioByUserId);
router.get('/u/:username', getPortfolioByUsername);

module.exports = router;