const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// SECURITY: Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  // If the password hasn't been changed/created, skip this
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generate a random "salt" and scramble the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);