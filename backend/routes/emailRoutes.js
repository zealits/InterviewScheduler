const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send-email', async (req, res) => {
  const { name, email, scheduledDate, linkedinProfile, resumeLink } = req.body;

  const emailContent = `
    <h2>Candidate Details</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Scheduled Date:</strong> ${scheduledDate}</p>
    <p><strong>LinkedIn Profile:</strong> <a href="${linkedinProfile}">${linkedinProfile}</a></p>
    <p><strong>Resume Link:</strong> <a href="${resumeLink}">${resumeLink}</a></p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Candidate Details for Review',
      html: emailContent,
    });

    res.status(200).send('Email sent successfully');
  } catch (error) {
    res.status(500).send('Error sending email: ' + error.message);
  }
});

module.exports = router;
