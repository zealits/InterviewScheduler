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
// exports.getAllInterviewers = async (req, res) => {
//   console.log("get all interviewers");
//   try {
//     const interviewers = await Interviewer.find();
//     res.status(200).json(interviewers);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// Get All Interviewers with optional filters
exports.getAllInterviewers = async (req, res) => {
  console.log("Get all interviewers with filters");
  try {
    // Extract query parameters
    const { specialization, mode } = req.query;

    // Build query object
    const query = {};
    if (specialization) query.specialization = specialization;
    if (mode) query["availability.mode"] = mode;

    // Fetch filtered interviewers from the database
    const interviewers = await Interviewer.find(query);

    // Respond with filtered or all interviewers
    res.status(200).json(interviewers);
  } catch (err) {
    console.error("Error fetching interviewers:", err);
    res.status(500).json({ message: "An error occurred while fetching interviewers" });
  }
};
