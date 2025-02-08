const express = require("express");
const { getAllUpcoming, postAllUpcoming } = require("../controllers/upcomingInterviews");
const { updateInterviewConfirmation } = require("../controllers/updateInterviewConfirmation");


const router = express.Router();

// Routes for upcoming interviews
router.get("/:email/upcoming-interviews", getAllUpcoming);
router.post("/:email/upcoming-interviews", postAllUpcoming);
router.post("/:email/pending-interviews", updateInterviewConfirmation);


module.exports = router;