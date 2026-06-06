const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Portfolio = require('../models/Portfolio');

// Initialize the AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Upload a resume, parse text, generate AI portfolio, and save to DB
// @route   POST /api/portfolios/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file." });
    }

    // 1. Extract raw text from the PDF
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    // 2. Define the strict instructions for the AI
    const prompt = `
      You are an expert resume parser. Read the following resume text and extract the information into a structured JSON format. 
      DO NOT include any conversational text, markdown formatting, or code blocks like \`\`\`json. Return ONLY raw, valid JSON.
      
      Use this EXACT JSON structure:
      {
        "personalInfo": {
          "name": "",
          "role": "Determine best job title",
          "bio": "Write a punchy 2-sentence professional summary",
          "email": "",
          "linkedin": "",
          "github": ""
        },
        "skills": ["skill 1", "skill 2"],
        "experience": [
          {
            "role": "",
            "company": "",
            "duration": "",
            "description": "Summarize their impact in 1-2 short sentences"
          }
        ],
        "projects": [
          {
            "title": "",
            "description": "Short summary of the project",
            "tags": ["tech1", "tech2"],
            "link": ""
          }
        ]
      }

      Resume Text to process:
      ${rawText}
    `;

    // 3. Send the text to Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text();

    // 4. Clean the AI response (just in case it adds markdown) and parse it into an object
    aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const portfolioData = JSON.parse(aiResponse);

    // 5. Save the perfectly formatted AI data to MongoDB, linking it to the logged-in user
    const savedPortfolio = await Portfolio.create({
      user: req.user._id, // This comes from our authMiddleware!
      template: 'developer', // Default template
      ...portfolioData
    });

    // 6. Send the finished product back to the frontend
    res.status(201).json({
      message: "AI successfully generated your portfolio!",
      portfolio: savedPortfolio
    });

  } catch (error) {
    console.error(`AI Generation Error: ${error.message}`);
    res.status(500).json({ message: "Failed to process the resume with AI." });
  }
};

// @desc    Get the logged-in user's portfolio
// @route   GET /api/portfolios/me
// @access  Private
const getUserPortfolio = async (req, res) => {
  try {
    // Find the portfolio where the user field matches the logged-in user's ID
    const portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      return res.status(404).json({ message: "No portfolio found for this user. Please upload a resume first!" });
    }

    res.status(200).json(portfolio);
  } catch (error) {
    console.error(`Error fetching portfolio: ${error.message}`);
    res.status(500).json({ message: "Server error while retrieving portfolio data." });
  }
};

// Export BOTH functions so the routes file can use them
module.exports = { uploadResume, getUserPortfolio };