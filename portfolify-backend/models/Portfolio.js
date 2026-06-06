const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  // Link this portfolio to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // Template choice (e.g., 'developer' or 'modern')
  template: {
    type: String,
    required: true,
    default: 'developer',
  },
  // Personal Info extracted from resume
  personalInfo: {
    name: String,
    role: String,
    bio: String,
    email: String,
    linkedin: String,
    github: String,
  },
  // Array of skills
  skills: [String],
  // Array of experience objects
  experience: [
    {
      role: String,
      company: String,
      duration: String,
      description: String,
    }
  ],
  // Array of project objects
  projects: [
    {
      title: String,
      description: String,
      tags: [String],
      link: String,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);