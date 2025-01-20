const express = require('express');
const { addInterviewer, getAllInterviewers } = require('../controllers/interviewerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
// Route to add a new interviewer
router.post('/add', addInterviewer);
// Route to get all interviewers
router.get('/getallinterviewer', getAllInterviewers);

module.exports = router;
