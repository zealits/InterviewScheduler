const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

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

exports.postAllUpcoming = async (req, res) => {
  console.log("hello")
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

    for (const interview of upcomingInterviews) {
      if (!interview.email || !interview.scheduledDate || !interview.name || !interview.jobTitle) {
        return res.status(400).json({ message: "Missing required fields in one or more interview entries" });
      }
    }

    user.upcomingInterviews.push(...upcomingInterviews);
    await user.save();

    // for (const interview of upcomingInterviews) {
    //   const candidateEmail = interview.email;
    //   const interviewerEmail = interview.interviewerEmail;
    //   const scheduledDate = interview.scheduledDate;
    //   const message = `Interview scheduled for ${interview.name} on ${scheduledDate}.`;

    //   await sendEmail({
    //     to: [candidateEmail, interviewerEmail, "admin@example.com"],
    //     subject: "Upcoming Interview Details",
    //     text: message,
    //   });
    // }

    res.status(201).json({ message: "Interviews added successfully and emails sent", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
