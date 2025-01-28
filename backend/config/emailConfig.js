const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Use environment variables for sensitive data
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = transporter;
