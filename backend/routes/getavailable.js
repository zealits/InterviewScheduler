const express = require("express");
const router = express.Router();
const { getAvailabilityForCalendar } = require("../controllers/getAvailabilityForCalendar ");
const { protect } = require("../middleware/Usermiddler");

router.get("/availability", protect,getAvailabilityForCalendar);

module.exports = router;
