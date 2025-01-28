const Interviewer = require("../models/Interviewer");

// Add Interviewer
exports.addInterviewer = async (req, res) => {
  try {
    const { name, email, contactNumber, specialization, experience, availability, remarks } = req.body;

    // Validate required fields
    // if (!name || !email || !contactNumber || !specialization || !experience || !availability) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    // Create new interviewer
    const interviewer = new Interviewer({
      name,
      email,
      contactNumber,
      specialization,
      experience,
      availability,
      remarks: remarks || "",
    });

    await interviewer.save();
    res.status(201).json({ message: "Interviewer added successfully", interviewer });
  } catch (err) {
    console.error("Error adding interviewer:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Add Candidate Details



// Get All Interviewers
exports.getAllInterviewers = async (req, res) => {
  try {
    const { specialization, mode } = req.query;

    const filter = {};
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: "i" };
    }
    if (mode) {
      filter["availability.mode"] = mode;
    }

    const interviewers = await Interviewer.find(filter);
    if (!interviewers.length) {
      return res.status(404).json({ message: "No interviewers found" });
    }

    res.status(200).json(interviewers);
  } catch (err) {
    console.error("Error fetching interviewers:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
