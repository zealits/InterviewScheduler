const express = require("express");
const {
  getAllUpcoming,
  postAllUpcoming,
  getAllPending,
} = require("../controllers/upcomingInterviews");
const {
  updateInterviewConfirmation,
} = require("../controllers/updateInterviewConfirmation");
const { uploadPDF } = require("../controllers/upcomingInterviews");
const router = express.Router();

// Routes for upcoming interviews
router.get("/:email/upcoming-interviews", getAllUpcoming);
router.get("/:email/pending-interviews", getAllPending);
router.post("/:email/upcoming-interviews", uploadPDF, postAllUpcoming); // Middleware for file upload
router.post("/:email/pending-interviews", updateInterviewConfirmation);

module.exports = router;
