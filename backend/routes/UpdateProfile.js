const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Fetch user profile
router.get("/user", async (req, res) => {
  try {
    const email = req.query.email; // Get email from query parameters
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Only select the fields needed for the UpdateProfile form
    const user = await User.findOne({ email }).select(
      "name email linkedinProfile yearOfExperience experienceAsInterviewer candidatesInterviewed specialization"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const { email, password, specialization, ...otherFields } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure specialization is an array
    const formattedSpecialization = Array.isArray(specialization)
      ? specialization
      : [specialization]; // Convert single value to array

    console.log("Updating profile with specialization:", formattedSpecialization); // ✅ Debugging step

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { ...otherFields, password: hashedPassword, specialization: formattedSpecialization },
      { new: true }
    ).select("-password"); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating profile:", error); // ✅ Debugging step
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
