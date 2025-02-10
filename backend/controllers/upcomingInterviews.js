const User = require("../models/User");
const multer = require("multer");

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for uploading a single PDF
exports.uploadPDF = upload.single("resume");

// Fetch all upcoming interviews for a specific user
// exports.getAllUpcoming = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const user = await User.findOne({ email });
    
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ upcomingInterviews: user.upcomingInterviews });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
exports.getAllUpcoming = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map and encode resume file as Base64
    const updatedInterviews = user.upcomingInterviews.map((interview) => {
      if (interview.resume && interview.resume.file && interview.resume.file.data) {
        return {
          ...interview,
          resume: {
            ...interview.resume,
            file: {
              contentType: interview.resume.file.contentType, // Ensure content type is preserved
              data: Buffer.from(interview.resume.file.data).toString("base64"),
            },
          },
        };
      }
      return interview;
    });

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

    // Parse `upcomingInterviews` if it's a string
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
      if (!interview.email || !interview.scheduledDate || !interview.name || !interview.jobTitle) {
        return res.status(400).json({
          message: "Missing required fields in one or more interview entries",
        });
      }

      if (req.file) {
        interview.resume = {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          file: req.file.buffer,
        };
      }

      user.upcomingInterviews.push(interview);
    }

    await user.save();
    // console.log("User:", user);
    res.status(201).json({ message: "Interviews added successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
