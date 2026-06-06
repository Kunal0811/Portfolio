require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // <-- 1. Import Auth Routes
const portfolioRoutes = require('./routes/portfolioRoutes');

// Initialize the app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // <-- 2. Mount Auth Routes under /api/auth
app.use('/api/portfolios', portfolioRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: "Portfolify AI Backend is Live! 🚀" });
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});