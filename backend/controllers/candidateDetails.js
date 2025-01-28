const Candidate = require("../models/Candidate");

exports.addCandidateDetails = async (req, res) => {
    try {
      const { name, email, linkedin, jobDescription } = req.body;
  
      // Validate fields
      // if (!name || !email || !linkedin || !jobDescription) {
      //   return res.status(400).json({ message: "All fields are required" });
      // }
  
      // Add candidate details (no interviewerId needed)
      const candidate = {
        name,
        email,
        linkedin,
        jobDescription,
      };
  
      // Assuming there's a separate collection or logic for storing candidates
      await Candidate.create(candidate);
  
      res.status(201).json({ message: "Candidate details added successfully", candidate });
    } catch (err) {
      console.error("Error adding candidate details:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  };