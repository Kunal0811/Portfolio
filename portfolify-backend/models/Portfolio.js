const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  template: { type: String, default: 'developer', enum: ['developer', 'modern', 'creative'] },
  inputMethod: { type: String, default: 'resume', enum: ['resume', 'form'] },
  accentColor: { type: String, default: '' }, // hex e.g. #6366f1

  personalInfo: {
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  skills: [String],
  experience: [{ role: String, company: String, duration: String, description: String }],
  projects: [{ title: String, description: String, tags: [String], link: String }],
  education: [{ degree: String, school: String, year: String, description: String }],
  certifications: [String],
  languages: [String],
  achievements: [String],

  // Analytics
  visitCount: { type: Number, default: 0 },
  lastVisited: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);