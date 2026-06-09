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

    // 2. Define strict instructions for the AI, adapting to zero-experience structures
    const prompt = `
      You are an expert resume parser. Read the following resume text and extract the information into a structured JSON format. 
      DO NOT include any conversational text, markdown formatting, or code blocks like \`\`\`json. Return ONLY raw, valid JSON.
      
      CRITICAL INSTRUCTIONS FOR EXPERIENCE:
      - IF the user has corporate or professional experience, extract it into the 'experience' array.
      - IF the user has NO professional work experience, leave 'experience' as an empty array [] and make sure to capture their academic projects, university coursework, or hackathons inside the 'projects' array.

      Use this EXACT JSON structure:
      {
        "personalInfo": {
          "name": "",
          "role": "Determine a clean professional job title based on their skills/track",
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
            "description": "Summarize their impact or responsibilities in 1-2 sentences"
          }
        ],
        "projects": [
          {
            "title": "",
            "description": "Short summary of what was built and why",
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
        "certifications": [],
        "languages": [],
        "achievements": []
      }

      Resume Text to process:
      ${rawText}
    `;

    // 3. Send the text to Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text();

    // 4. Clean the AI response wrapper and parse it into an object
    aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const portfolioData = JSON.parse(aiResponse);

    // 5. Save or update the perfectly formatted AI data in MongoDB
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (portfolio) {
      // Overwrite existing data with newly parsed resume info
      Object.assign(portfolio, portfolioData);
      portfolio.inputMethod = 'resume';
      await portfolio.save();
    } else {
      // Create fresh entry
      portfolio = await Portfolio.create({
        user: req.user._id,
        inputMethod: 'resume',
        template: 'developer',
        ...portfolioData
      });
    }

    res.status(201).json({
      message: "AI successfully generated your portfolio!",
      portfolio
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

// @desc    Get a portfolio by User ID (Publicly viewable)
// @route   GET /api/portfolios/user/:userId
// @access  Public
const getPortfolioByUserId = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.params.userId });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found." });
    }

    res.status(200).json(portfolio);
  } catch (error) {
    console.error(`Error fetching public portfolio: ${error.message}`);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Manually create or completely update portfolio via custom form
// @route   POST /api/portfolios/manual
// @access  Private
const createManualPortfolio = async (req, res) => {
  try {
    const { 
      personalInfo, 
      skills, 
      experience, 
      projects, 
      education, 
      certifications, 
      languages, 
      achievements 
    } = req.body;

    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (portfolio) {
      // Update the fields on the existing record
      portfolio.personalInfo = personalInfo;
      portfolio.skills = skills;
      portfolio.experience = experience;
      portfolio.projects = projects;
      portfolio.education = education;
      portfolio.certifications = certifications;
      portfolio.languages = languages;
      portfolio.achievements = achievements;
      portfolio.inputMethod = 'form';
      
      await portfolio.save();
    } else {
      // Create a brand new record if none exists
      portfolio = await Portfolio.create({
        user: req.user._id,
        template: 'developer',
        inputMethod: 'form',
        personalInfo,
        skills,
        experience,
        projects,
        education,
        certifications,
        languages,
        achievements
      });
    }

    res.status(200).json({
      message: "Portfolio successfully saved manually!",
      portfolio
    });
  } catch (error) {
    console.error(`Manual Save Error: ${error.message}`);
    res.status(500).json({ message: "Server error saving manual portfolio data." });
  }
};

// @desc    Switch or update the chosen user interface layout template
// @route   PATCH /api/portfolios/template
// @access  Private
const updateTemplate = async (req, res) => {
  try {
    const { template } = req.body;

    // Validate enum options safely
    if (!['developer', 'modern', 'creative'].includes(template)) {
      return res.status(400).json({ message: "Invalid template style name choice." });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { template },
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({ message: "No active portfolio profile found to update." });
    }

    res.status(200).json({
      message: "Layout template selection successfully updated!",
      portfolio
    });
  } catch (error) {
    console.error(`Template Switch Error: ${error.message}`);
    res.status(500).json({ message: "Error changing interface layout template preference." });
  }
};

module.exports = { 
  uploadResume, 
  getUserPortfolio, 
  getPortfolioByUserId, 
  createManualPortfolio, 
  updateTemplate 
};