const User = require("../models/User"); // Replace with the actual path to your schema

// Controller to update confirmation status
exports.updateInterviewConfirmation = async (req, res) => {
  const { email, interviewId } = req.body;
  console.log(email, interviewId);
  if (!email || !interviewId) {
    return res.status(400).json({ message: "User email and Interview ID are required." });
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

// Controller to delete an interview
// exports.deleteInterview = async (req, res) => {
//   const { email, interviewId } = req.body;

//   if (!email || !interviewId) {
//     return res.status(400).json({ message: "User email and Interview ID are required." });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     const interviewIndex = user.upcomingInterviews.findIndex(
//       (interview) => interview._id.toString() === interviewId
//     );

//     if (interviewIndex === -1) {
//       return res.status(404).json({ message: "Interview not found." });
//     }

//     user.upcomingInterviews.splice(interviewIndex, 1);
//     await user.save();

//     res.status(200).json({ message: "Interview deleted successfully." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "An error occurred while deleting the interview." });
//   }
// };
