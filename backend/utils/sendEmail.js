const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use another service or a service like SendGrid
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: to, 
    subject: subject, 
    text: text,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


module.exports= sendEmail;