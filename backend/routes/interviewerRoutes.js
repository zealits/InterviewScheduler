const express = require("express");
const { getAllUpcoming, postAllUpcoming } = require("../controllers/upcomingInterviews");

const router = express.Router();

// Routes for upcoming interviews
router.get("/:email/upcoming-interviews", getAllUpcoming);
router.post("/:email/upcoming-interviews", postAllUpcoming);

module.exports = router;
