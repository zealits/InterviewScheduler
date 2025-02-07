const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const interviewerRoutes = require("./routes/interviewerRoutes");
const getavailable = require("./routes/getavailable");
const emailRoutes = require("./routes/emailRoutes");
const updateProfile = require("./routes/UpdateProfile");
const path = require("path");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviewers", interviewerRoutes);
app.use("/api/user", getavailable);
app.use("/api", updateProfile);
// app.use("/api", emailRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route to serve React's index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});
module.exports = app;
