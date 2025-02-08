const User = require("../models/User"); // Replace with the actual path to your schema

// Controller to update confirmation status
exports.updateInterviewConfirmation = async (req, res) => {
  const { email, interviewId } = req.body;
  console.log(email , interviewId);
  if (!email || !interviewId) {
    return res.status(400).json({ message: "User ID and Interview ID are required." });
  }



            try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });

    }

    const interview = user.upcomingInterviews.id(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    interview.confirmation = true;

    await user.save();

    res.status(200).json({
      message: "Interview confirmation updated successfully.",
      interview,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while updating confirmation." });
  }
};
