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
      "name email  linkedinProfile yearOfExperience experienceAsInterviewer candidatesInterviewed specialization"
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

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Build the update object
    const updateData = { ...otherFields };

    // Only hash and update the password if it's provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Ensure specialization is an array if provided
    if (specialization) {
      updateData.specialization = Array.isArray(specialization)
        ? specialization
        : [specialization];
    }

    console.log("Updating profile with data:", updateData);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/specializations", async (req, res) => {
  try {
    // Fetch all users and extract their specializations
    const users = await User.find({}, { specialization: 1, _id: 0 });

    // Collect all specializations into a single array
    const allSpecializations = users.reduce((acc, user) => {
      if (Array.isArray(user.specialization)) {
        return [...acc, ...user.specialization];
      }
      return acc;
    }, []);

    // Remove duplicates
    const uniqueSpecializations = [...new Set(allSpecializations)];

    res.status(200).json(uniqueSpecializations);
  } catch (error) {
    console.error("❌ Error fetching specializations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
