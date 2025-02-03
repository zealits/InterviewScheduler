const User = require("../models/User");

// Get upcoming interviews for a specific user using email
exports.getAllUpcoming = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ upcomingInterviews: user.upcomingInterviews });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add upcoming interviews to a specific user using email
exports.postAllUpcoming = async (req, res) => {
  try {
    const { email } = req.params;
    const { upcomingInterviews } = req.body;

    if (!Array.isArray(upcomingInterviews) || upcomingInterviews.length === 0) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate required fields for each interview entry
    for (const interview of upcomingInterviews) {
      if (!interview.email || !interview.scheduledDate || !interview.name || !interview.linkedin || !interview.resume) {
        return res.status(400).json({ message: "Missing required fields in one or more interview entries" });
      }
    }

    // Add the new interviews to the user's upcomingInterviews array
    user.upcomingInterviews.push(...upcomingInterviews);
    await user.save();

    res.status(201).json({ message: "Interviews added successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
