const User = require("../models/User");
const multer = require("multer");
const sendEmail = require("../utils/sendEmail");

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for uploading a single PDF
exports.uploadPDF = upload.single("resume");

exports.getAllPending = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map only the required fields for each interview
    const updatedInterviews = user.upcomingInterviews.map((interview) => ({
      _id: interview._id, // Include _id for identification
      jobTitle: interview.jobTitle,
      email: interview.email,
      name: interview.name,
      scheduledDate: interview.scheduledDate,
      interviewStartTime: interview.interviewStartTime,
      interviewEndTime: interview.interviewEndTime,
      confirmation: interview.confirmation,
      specialization: Array.isArray(interview.specialization) 
      ? interview.specialization 
      : [interview.specialization], // Ensure it's always an array
    }));

    res.status(200).json({ upcomingInterviews: updatedInterviews });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add new upcoming interviews for a specific user
exports.postAllUpcoming = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("Params:", req.params);

    const { email } = req.params;
    let { upcomingInterviews } = req.body;

    // Ensure `upcomingInterviews` is an array
    if (typeof upcomingInterviews === "string") {
      try {
        upcomingInterviews = JSON.parse(upcomingInterviews);
      } catch (parseError) {
        return res
          .status(400)
          .json({ message: "Invalid JSON format for upcomingInterviews" });
      }
    }

    if (!Array.isArray(upcomingInterviews) || upcomingInterviews.length === 0) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    for (const interview of upcomingInterviews) {
      // Validate required fields
      if (
        !interview.email ||
        // !interview.interviewTime ||
        !interview.specialization ||
        !interview.name
      ) {
        return res.status(400).json({
          message: `Missing required fields for interview: ${JSON.stringify(
            interview
          )}`,
        });
      }

      // Process Resume if attached
      if (req.file) {
        interview.hasResume = true;
        interview.resume = {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          file: req.file.buffer,
        };
        interview.resumeFilename = req.file.originalname;
      } else {
        interview.hasResume = false;
      }

      user.upcomingInterviews.push(interview);
    }

    await user.save();

    res.status(201).json({ message: "Interviews added successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get upcoming interviews without sending the resume file data
exports.getUpcomingInterviews = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("upcomingInterviews");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // For each interview, remove the resume file data but include a flag and filename
    const interviews = user.upcomingInterviews.map((interview) => {
      const { resume, ...rest } = interview.toObject();
      return {
        ...rest,
        hasResume: !!resume,
        resumeFilename: resume ? resume.filename : null,
      };
    });
    res.status(200).json({ upcomingInterviews: interviews });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Endpoint to get the resume PDF for a specific interview
exports.getInterviewResume = async (req, res) => {
  try {
    const { email, interviewId } = req.params;
    const user = await User.findOne({ email }).select("upcomingInterviews");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const interview = user.upcomingInterviews.id(interviewId);
    if (!interview || !interview.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.set("Content-Type", interview.resume.contentType);
    res.send(interview.resume.file);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
