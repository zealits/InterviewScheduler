const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  linkedin: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
});

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
