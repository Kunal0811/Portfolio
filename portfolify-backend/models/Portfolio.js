const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  template: { 
    type: String, 
    default: 'developer', 
    enum: ['developer', 'modern', 'creative'] 
  },
  inputMethod: { 
    type: String, 
    default: 'resume', 
    enum: ['resume', 'form'] 
  },
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
  experience: [{
    role: String,
    company: String,
    duration: String,
    description: String
  }],
  projects: [{
    title: String,
    description: String,
    tags: [String],
    link: String
  }],
  education: [{
    degree: String,
    school: String,
    year: String,
    description: String
  }],
  certifications: [String],
  languages: [String],
  achievements: [String],
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);