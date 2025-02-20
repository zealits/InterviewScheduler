const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/authRoutes");
const emailRoute = require("./routes/emailRoute");
const interviewerRoutes = require("./routes/interviewerRoutes");
const getavailable = require("./routes/getavailable");
const updateProfile = require("./routes/UpdateProfile");
// const sendEmail = require("./utils/sendEmail");
const path = require("path");
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviewers", interviewerRoutes);
app.use("/api/user", getavailable);
app.use("/api", updateProfile);
app.use("/api/admin", adminRoutes);
app.use("/api/email", emailRoute);


// app.post("/send-email", async (req, res) => {
//   const { email, subject, text, html } = req.body;

//   await sendEmail(email, subject, text, html);
//   res.status(200).send("Email sent successfully!");
// });

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route to serve React's index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});
module.exports = app;
