const express = require("express");
const {
  getUpcomingInterviews,
  postAllUpcoming,
  getAllPending,
  getInterviewResume,
} = require("../controllers/upcomingInterviews");
const {
  updateInterviewConfirmation,
} = require("../controllers/updateInterviewConfirmation");
const {
  declineInterview,
  getDeclinedInterviews,
} = require("../controllers/declineInterview");

const { uploadPDF } = require("../controllers/upcomingInterviews");
const router = express.Router();

// Routes for upcoming interviews
router.get("/:email/upcoming-interviews", getUpcomingInterviews);
router.get("/:email/pending-interviews", getAllPending);
router.post("/:email/upcoming-interviews", uploadPDF, postAllUpcoming); // Middleware for file upload
router.post("/:email/pending-interviews", updateInterviewConfirmation);

router.post("/:email/decline-interview", declineInterview);
router.get("/:email/decline-interview", getDeclinedInterviews);

// New endpoint for fetching resume PDF on-demand
router.get("/:email/interviews/:interviewId/resume", getInterviewResume);

module.exports = router;
