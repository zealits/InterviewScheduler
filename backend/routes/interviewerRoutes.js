const express = require('express');
const { addInterviewer, getAllInterviewers } = require('../controllers/interviewerController');
const {addCandidateDetails} =require('../controllers/candidateDetails')

const router = express.Router();

// Add Interviewer
router.post('/add', addInterviewer);

// Add Candidate to Interviewer
router.post('/addcandidate', addCandidateDetails);


// Get All Interviewers
router.get('/getallinterviewer', getAllInterviewers);

module.exports = router;
