const express = require('express');
const router = express.Router();
const { 
  uploadResume, 
  createManualPortfolio, 
  updateTemplate, 
  getUserPortfolio, 
  getPortfolioByUserId 
} = require('../controllers/portfolioController');

const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Private Workspace Routes
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/manual', protect, createManualPortfolio);
router.patch('/template', protect, updateTemplate);
router.get('/me', protect, getUserPortfolio);

// Public View Route
router.get('/user/:userId', getPortfolioByUserId); 

module.exports = router;