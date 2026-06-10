const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc  Upload resume → AI extract → save
// @route POST /api/portfolios/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload a PDF file." });

    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    const prompt = `
      You are an expert resume parser. Extract information into a structured JSON format.
      DO NOT include markdown or code blocks. Return ONLY raw valid JSON.
      
      CRITICAL: IF the user has NO professional work experience, leave 'experience' as [] and capture academic projects/coursework in 'projects'.

      Use this EXACT JSON structure:
      {
        "personalInfo": {
          "name": "",
          "role": "Clean professional job title based on skills/track",
          "bio": "Punchy 2-sentence professional summary highlighting key strengths",
          "email": "", "phone": "", "location": "",
          "linkedin": "", "github": "", "website": ""
        },
        "skills": ["skill 1", "skill 2"],
        "experience": [{ "role": "", "company": "", "duration": "", "description": "1-2 sentences of impact" }],
        "projects": [{ "title": "", "description": "What was built and why", "tags": ["tech1"], "link": "" }],
        "education": [{ "degree": "", "school": "", "year": "", "description": "" }],
        "certifications": [],
        "languages": [],
        "achievements": []
      }

      Resume Text:
      ${rawText}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const portfolioData = JSON.parse(aiResponse);

    let portfolio = await Portfolio.findOne({ user: req.user._id });
    if (portfolio) {
      Object.assign(portfolio, portfolioData);
      portfolio.inputMethod = 'resume';
      await portfolio.save();
    } else {
      portfolio = await Portfolio.create({
        user: req.user._id, inputMethod: 'resume', template: 'developer', ...portfolioData
      });
    }

    res.status(201).json({ message: "Portfolio generated!", portfolio });
  } catch (error) {
    console.error(`AI Error: ${error.message}`);
    res.status(500).json({ message: "Failed to process resume with AI." });
  }
};

// @desc  Regenerate bio using AI
// @route POST /api/portfolios/regenerate-bio
const regenerateBio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.status(404).json({ message: "No portfolio found." });

    const { personalInfo, skills, experience, projects } = portfolio;
    const prompt = `
      Write a compelling 2-sentence professional bio for this person.
      Name: ${personalInfo.name}, Role: ${personalInfo.role}
      Skills: ${skills.slice(0, 8).join(', ')}
      Experience: ${experience.map(e => `${e.role} at ${e.company}`).join(', ') || 'Student/Fresher'}
      Projects: ${projects.map(p => p.title).join(', ')}
      Return ONLY the bio text, no quotes, no extra text.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const newBio = result.response.text().trim();

    portfolio.personalInfo.bio = newBio;
    await portfolio.save();

    res.json({ bio: newBio, message: "Bio regenerated!" });
  } catch (error) {
    console.error(`Bio regen error: ${error.message}`);
    res.status(500).json({ message: "Failed to regenerate bio." });
  }
};

// @desc  Get current user's portfolio
// @route GET /api/portfolios/me
const getUserPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.status(404).json({ message: "No portfolio found. Upload a resume first!" });
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// @desc  Get portfolio by user ID (public)
// @route GET /api/portfolios/user/:userId
const getPortfolioByUserId = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.params.userId });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found." });

    // Increment visit count
    portfolio.visitCount = (portfolio.visitCount || 0) + 1;
    portfolio.lastVisited = new Date();
    await portfolio.save();

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// @desc  Get portfolio by username (public)  
// @route GET /api/portfolios/u/:username
const getPortfolioByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found." });

    const portfolio = await Portfolio.findOne({ user: user._id });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found." });

    // Increment visit count
    portfolio.visitCount = (portfolio.visitCount || 0) + 1;
    portfolio.lastVisited = new Date();
    await portfolio.save();

    res.status(200).json({ ...portfolio.toObject(), ownerName: user.name, ownerUsername: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// @desc  Manually create/update portfolio
// @route POST /api/portfolios/manual
const createManualPortfolio = async (req, res) => {
  try {
    const { personalInfo, skills, experience, projects, education, certifications, languages, achievements } = req.body;

    let portfolio = await Portfolio.findOne({ user: req.user._id });
    const data = { personalInfo, skills, experience, projects, education, certifications, languages, achievements, inputMethod: 'form' };

    if (portfolio) {
      Object.assign(portfolio, data);
      await portfolio.save();
    } else {
      portfolio = await Portfolio.create({ user: req.user._id, template: 'developer', ...data });
    }

    res.status(200).json({ message: "Portfolio saved!", portfolio });
  } catch (error) {
    console.error(`Manual save error: ${error.message}`);
    res.status(500).json({ message: "Server error saving portfolio." });
  }
};

// @desc  Update template + accent color
// @route PATCH /api/portfolios/template
const updateTemplate = async (req, res) => {
  try {
    const { template, accentColor } = req.body;
    if (template && !['developer', 'modern', 'creative'].includes(template)) {
      return res.status(400).json({ message: "Invalid template name." });
    }

    const updates = {};
    if (template) updates.template = template;
    if (accentColor) updates.accentColor = accentColor;

    const portfolio = await Portfolio.findOneAndUpdate({ user: req.user._id }, updates, { new: true });
    if (!portfolio) return res.status(404).json({ message: "No portfolio found." });

    res.status(200).json({ message: "Template updated!", portfolio });
  } catch (error) {
    res.status(500).json({ message: "Error updating template." });
  }
};

// @desc  Get portfolio analytics
// @route GET /api/portfolios/analytics
const getAnalytics = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.status(404).json({ message: "No portfolio found." });

    res.json({
      visitCount: portfolio.visitCount || 0,
      lastVisited: portfolio.lastVisited || null,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  uploadResume, regenerateBio, getUserPortfolio, getPortfolioByUserId, getPortfolioByUsername,
  createManualPortfolio, updateTemplate, getAnalytics
};