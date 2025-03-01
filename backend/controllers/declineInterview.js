const User = require("../models/User");

exports.declineInterview = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    const {
      scheduledDate,
      interviewStartTime,
      interviewEndTime,
      specialization,
      name,
      resume,
      jobTitle,
      linkedin,
    } = req.body;

    // Create a validation object to store error messages
    const validationErrors = {};

    if (!scheduledDate) {
      validationErrors.scheduledDate = "Scheduled Date is required";
    }
    if (!interviewStartTime) {
      validationErrors.interviewStartTime = "Interview start time is required";
    }
    if (!interviewEndTime) {
      validationErrors.interviewEndTime = "Interview end time is required";
    }
    if (!specialization) {
      validationErrors.specialization = "Specialization is required";
    }
    if (!jobTitle) {
      validationErrors.jobTitle = "Job title is required";
    }

    // If any validation errors exist, return them immediately
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        errors: validationErrors,
      });
    }

    // Create the new declined interview object using validated data
    const declinedInterview = {
      email,
      name,
      scheduledDate,
      interviewStartTime,
      interviewEndTime,
      specialization,
      jobTitle,
      resume,
      linkedin,
      confirmation: false,
    };

    // Use the provided email to find the specific user and push the new declined interview.
    const interview = await User.findOneAndUpdate(
      { email },
      { $push: { declinedInterviews: declinedInterview } },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(201)
      .json({ message: "Interview declined successfully", interview });
  } catch (error) {
    console.error("Error declining interview:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getDeclinedInterviews = async (req, res) => {
  try {
    // Retrieve the declinedInterviews field from all users
    const interviews = await User.find({}, "declinedInterviews");
    res.status(200).json({ declinedInterviews: interviews });
  } catch (error) {
    console.error("Error fetching declined interviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
