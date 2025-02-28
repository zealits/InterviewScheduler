const nodemailer = require("nodemailer");
const User = require("../models/User");
const Admin = require("../models/Admin"); // Ensure correct casing

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
      interviewStartTime,
      interviewEndTime,
      jobDescription,
      candidateLinkedIn,
    } = req.body;

    if (
      !recipient ||
      !subject ||
      !candidateName ||
      !jobTitle ||
      !scheduledDate ||
      !interviewStartTime ||
      !interviewEndTime
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Fetch admin emails from database
    const adminEmails = await Admin.find().select("email");
    const adminEmailList = adminEmails.map((a) => a.email);

    const isAdmin = adminEmailList.includes(recipient); // ✅ Correct check

    let emailContent;

    if (isAdmin) {
      emailContent = {
        subject: `New Interview Scheduled for ${candidateName}`,
        text: `Hello Admin,\n\nA new interview has been scheduled.\n\n
Candidate: ${candidateName}\n
Job Title: ${jobTitle}\n
Interviewer: ${interviewerEmail}\n
Scheduled Date: ${scheduledDate}\n
Interview Start Time: ${interviewStartTime}\n
Interview End Time: ${interviewEndTime}\n
Specialization: ${specialization}\n
Job Description: ${jobDescription}\n
Candidate LinkedIn: ${candidateLinkedIn}\n\n
Please ensure all arrangements are in place.\n`,
        html: `<h2>Hello Admin,</h2>
          <p>A new interview has been scheduled.</p>
          <p><strong>Candidate:</strong> ${candidateName}</p>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          <p><strong>Interviewer:</strong> ${interviewerEmail}</p>
          <p><strong>Scheduled Date:</strong> ${scheduledDate}</p>
          <p><strong>Interview Start Time:</strong> ${interviewStartTime}</p>
          <p><strong>Interview End Time:</strong> ${interviewEndTime}</p>
          <p><strong>Specialization:</strong> ${specialization}</p>
          <p><strong>Job Description:</strong> ${jobDescription}</p>
          <p><strong>Candidate LinkedIn:</strong> <a href="${candidateLinkedIn}" target="_blank">${candidateLinkedIn}</a></p>
          <p>Please ensure all arrangements are in place.</p>`,
      };
    } else {
      emailContent = {
        subject: `Upcoming Interview: ${candidateName} - ${jobTitle}`,
        text: `Hello,\n\nYou have been assigned an upcoming interview.\n\n
Candidate: ${candidateName}\n
Job Title: ${jobTitle}\n
Interviewer: ${interviewerEmail}\n
Interview Start Time: ${interviewStartTime}\n
Interview End Time: ${interviewEndTime}\n
Scheduled Date: ${scheduledDate}\n
Job Description: ${jobDescription}\n
Candidate LinkedIn: ${candidateLinkedIn}\n\n
Please be prepared for the interview.\n`,
        html: `<h2>Hello,</h2>
          <p>You have been assigned an upcoming interview.</p>
          <p><strong>Candidate:</strong> ${candidateName}</p>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          <p><strong>Interviewer:</strong> ${interviewerEmail}</p>
          <p><strong>Interview Start Time:</strong> ${interviewStartTime}</p>
          <p><strong>Interview End Time:</strong> ${interviewEndTime}</p>
          <p><strong>Scheduled Date:</strong> ${scheduledDate}</p>
          <p><strong>Job Description:</strong> ${jobDescription}</p>
          <p><strong>Candidate LinkedIn:</strong> <a href="${candidateLinkedIn}" target="_blank">${candidateLinkedIn}</a></p>
          <p>Please be prepared for the interview.</p>`,
      };
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });

    console.log("Sending email to:", recipient); // Debugging

    // ✅ Send email
    await transporter.sendMail({
      from: process.env.SMPT_MAIL,
      to: recipient,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
};
