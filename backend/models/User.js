// User Model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  linkedinProfile: { type: String, required: true },
  yearOfExperience: { type: Number, required: true },
  experienceAsInterviewer: { type: Boolean, required: true },
  specialization: { type: String, required: true }, // e.g., language, cloud, AI, domain
  candidatesInterviewed: { type: Number, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
