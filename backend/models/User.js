const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  linkedinProfile: { type: String, required: true },
  yearOfExperience: { type: Number, required: true },
  experienceAsInterviewer: { type: Number, required: true },
  specialization: { type: String, required: true }, // e.g., language, cloud, AI, domain
  candidatesInterviewed: { type: Number, required: true },
  availability: {
    type: String,
    enum: ["Range Selection", "Custom"],
  },
  availabilityRange: [
    {
      startDate: { type: Date, required: true }, // Starting date of the range
      endDate: { type: Date, required: true },   // Ending date of the range
      startTime: { type: String, required: true }, // Starting time (e.g., "09:00 AM")
      endTime: { type: String, required: true },   // Ending time (e.g., "05:00 PM")
    },
  ],
  customAvailability:[
    {
      dates: [{ type: Date,required:true }], // List of manually selected dates
    },
  ],
  upcomingInterviews: [
    {
      email: {
        type: String,
        required: [true, "Email is required"],
      },
      scheduledDate: {
        type: Date,
        required: [true, "Scheduled Date is required"],
      },
      details: { type: String },
    },
  ],
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
