const express = require("express");
const { register, login, getAdminEmail } = require("../controllers/authController");
const { registeruser, loginuser } = require("../controllers/UserauthController");
const { updateUserProfile } = require("../controllers/updateUserProfile");
const { protectUser } = require("../middleware/UserMid");
const { authenticateAdmin } = require("../middleware/authMiddleware");
const { sendEmail } = require("../controllers/emailController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/user/register", registeruser);
router.post("/user/login", loginuser);

router.get("/:email/admin-email", authenticateAdmin, getAdminEmail);

// Fixed Send Email Route
router.post("/send-email", async (req, res) => {
  const { recipient, subject, candidateName, interviewerEmail, jobTitle, scheduledDate, startTime, endTime, jobDescription, candidateLinkedIn } = req.body;

  if (!recipient || !subject || !candidateName || !jobTitle || !scheduledDate || !startTime || !endTime || !jobDescription || !candidateLinkedIn) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await sendEmail(
      recipient,
      subject,
      candidateName,
      interviewerEmail,
      jobTitle,
      scheduledDate,
      startTime,
      endTime,
      jobDescription,
      candidateLinkedIn
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Email sending failed" });
  }
});

router.put("/profile", protectUser, updateUserProfile);

module.exports = router;
