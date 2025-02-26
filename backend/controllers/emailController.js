const nodemailer = require("nodemailer");
const User = require("../models/User");
const admin = require("../models/Admin");

exports.sendEmail = async (req, res) => {
  try {
    const {
      recipient,
      subject,
      candidateName,
      interviewerEmail,
      jobTitle,
      scheduledDate,
      specialization,
      interviewTime,
      startTime,
      endTime,
      jobDescription,
      candidateLinkedIn,
    } = req.body;

    if (!recipient || !subject || !candidateName || !jobTitle || !scheduledDate || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // **Check if the recipient is Admin or Interviewer**
    const isAdmin = recipient.includes("adminEmail",admin.email); // Adjust this condition as needed

    let emailContent;

    if (isAdmin) {
      // **Admin Email Format**
      emailContent = {
        subject: `New Interview Scheduled for ${candidateName}`,
        text: `Hello Admin,\n\nA new interview has been scheduled.\n\n
        Candidate: ${candidateName}\n
        Job Title: ${jobTitle}\n
        Interviewer: ${interviewerEmail}\n
        Scheduled Date: ${scheduledDate}\n
        interviewTime: ${interviewTime}\n
        Specialization: ${specialization}\n
        Job Description: ${jobDescription}\n
        Candidate LinkedIn: ${candidateLinkedIn}\n\n
        Please ensure all arrangements are in place.\n`,
        
        html: `
          <h2>Hello Admin,</h2>
          <p>A new interview has been scheduled.</p>
          <p><strong>Candidate:</strong> ${candidateName}</p>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          <p><strong>Interviewer:</strong> ${interviewerEmail}</p>
          <p><strong>Scheduled Date:</strong> ${scheduledDate}</p>
          <p><strong>interviewTime:</strong> ${interviewTime} </p>
          <p><strong>Specialization:</strong> ${specialization}</p>
          <p><strong>Job Description:</strong> ${jobDescription}</p>
          <p><strong>Candidate LinkedIn:</strong> <a href="${candidateLinkedIn}" target="_blank">${candidateLinkedIn}</a></p>
          <p>Please ensure all arrangements are in place.</p>
        `,
      };
    } else {
      // **Interviewer Email Format**
      emailContent = {
        subject: `Upcoming Interview: ${candidateName} - ${jobTitle}`,
        text: `Hello,\n\nYou have been assigned an upcoming interview.\n\n
        Candidate: ${candidateName}\n
        Job Title: ${jobTitle}\n
        Scheduled Date: ${scheduledDate}\n
        Time: ${startTime} - ${endTime}\n
        Job Description: ${jobDescription}\n
        Candidate LinkedIn: ${candidateLinkedIn}\n\n
        Please be prepared for the interview.\n`,
        
        html: `
          <h2>Hello,</h2>
          <p>You have been assigned an upcoming interview.</p>
          <p><strong>Candidate:</strong> ${candidateName}</p>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          <p><strong>Scheduled Date:</strong> ${scheduledDate}</p>
          <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
          <p><strong>Job Description:</strong> ${jobDescription}</p>
          <p><strong>Candidate LinkedIn:</strong> <a href="${candidateLinkedIn}" target="_blank">${candidateLinkedIn}</a></p>
          <p>Please be prepared for the interview.</p>
        `,
      };
    }

    // **Send Email**
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Email sending failed" });
  }
};