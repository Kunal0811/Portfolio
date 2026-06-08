const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Portfolio = require('../models/Portfolio');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Upload a resume PDF → AI parses → upsert portfolio
// @route   POST /api/portfolios/upload
// @access  Private
const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload a PDF file." });

    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

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
          "phone": "",
          "location": "",
          "linkedin": "",
          "github": "",
          "website": ""
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
        ],
        "education": [
          {
            "degree": "",
            "school": "",
            "year": "",
            "description": ""
          }
        ],
        "certifications": ["cert 1", "cert 2"],
        "languages": ["language 1"],
        "achievements": ["achievement 1"]
      }

      Resume Text to process:
      ${rawText}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text();
    aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const portfolioData = JSON.parse(aiResponse);

    // UPSERT: update if exists, create if not
    const savedPortfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, inputMethod: 'resume', ...portfolioData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: "AI successfully generated your portfolio!", portfolio: savedPortfolio });
  } catch (error) {
    console.error(`AI Generation Error: ${error.message}`);
    res.status(500).json({ message: "Failed to process the resume with AI." });
  }
};

// @desc    Create/update portfolio from manual form data
// @route   POST /api/portfolios/manual
// @access  Private
const createManualPortfolio = async (req, res) => {
  try {
    const { personalInfo, skills, experience, projects, education, certifications, languages, achievements } = req.body;

    if (!personalInfo || !personalInfo.name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const savedPortfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        inputMethod: 'form',
        personalInfo,
        skills: skills || [],
        experience: experience || [],
        projects: projects || [],
        education: education || [],
        certifications: certifications || [],
        languages: languages || [],
        achievements: achievements || []
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: "Portfolio saved successfully!", portfolio: savedPortfolio });
  } catch (error) {
    console.error(`Manual Portfolio Error: ${error.message}`);
    res.status(500).json({ message: "Failed to save portfolio." });
  }
};

// @desc    Update portfolio template
// @route   PATCH /api/portfolios/template
// @access  Private
const updateTemplate = async (req, res) => {
  try {
    const { template } = req.body;
    const validTemplates = ['developer', 'modern', 'creative'];
    if (!validTemplates.includes(template)) {
      return res.status(400).json({ message: "Invalid template." });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { template },
      { new: true }
    );

    if (!portfolio) return res.status(404).json({ message: "No portfolio found." });
    res.status(200).json({ message: "Template updated!", portfolio });
  } catch (error) {
    res.status(500).json({ message: "Failed to update template." });
  }
};

// @desc    Get logged-in user's portfolio
// @route   GET /api/portfolios/me
// @access  Private
const getUserPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.status(404).json({ message: "No portfolio found." });
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Get portfolio by User ID (public)
// @route   GET /api/portfolios/user/:userId
// @access  Public
const getPortfolioByUserId = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.params.userId });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found." });
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { uploadResume, createManualPortfolio, updateTemplate, getUserPortfolio, getPortfolioByUserId };