const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  linkedinProfile: { type: String, required: true },
  yearOfExperience: { type: Number, required: true },
  experienceAsInterviewer: { type: Number, required: true },
  specialization: { type: Object, required: true }, // e.g., language, cloud, AI, domain
  candidatesInterviewed: { type: Number, required: true },
  availability: {
    type: String,
    enum: ["Range Selection", "Custom"],
  },
  availabilityRange: [
    {
      startDate: { type: Date, required: true }, // Starting date of the range
      endDate: { type: Date, required: true }, // Ending date of the range
      startTime: { type: String, required: true }, // Starting time (e.g., "09:00 AM")
      endTime: { type: String, required: true }, // Ending time (e.g., "05:00 PM")
      timezone: { type: String, required: true },
    },
  ],
  customAvailability: [
    {
      dates: [{ type: Date, required: true }], // List of manually selected dates
      startTime: { type: String, required: true }, // Starting time (e.g., "09:00 AM")
      endTime: { type: String, required: true }, // Ending time (e.g., "05:00 PM")
      timezone: { type: String, required: true },
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
      // scheduledTime: {
      //   type: String,
      // },
      interviewStartTime: {
        type: String,
      },
      interviewEndTime: {
        type: String,
      },
      specialization: [
        {
          type: String,
          required: [true, "Specialization is required"],
        },
      ],
      name: {
        type: String,
        required: true,
      },
      linkedin: {
        type: String,
      },
      resume: {
        filename: { type: String }, // Original file name
        contentType: { type: String }, // MIME type (e.g., "application/pdf")
        file: { type: Buffer }, // Binary data of the file
      },
      jobTitle: { type: String },
      details: { type: String },
      confirmation: { type: Boolean, default: false },
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
