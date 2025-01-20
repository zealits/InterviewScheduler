const Interviewer = require('../models/Interviewer');

// Add Interviewer
exports.addInterviewer = async (req, res) => {
    console.log(req.body);
  try {
    const interviewer = await Interviewer.create(req.body);
    console.log(req.body);
    res.status(201).json(interviewer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Interviewers
exports.getAllInterviewers = async (req, res) => {
  console.log("get all interviewers");
  try {
    const interviewers = await Interviewer.find();
    res.status(200).json(interviewers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
