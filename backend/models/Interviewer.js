// const mongoose = require('mongoose');

// const interviewerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   contactNumber: { type: String, required: true },
//   specialization: { type: String },
//   availability: [
//     {
//       date: { type: Date, required: true },
//       time: { type: String, required: true },
//       timezone: { type: String, required: true },
//       mode: { type: String, enum: ['online', 'offline'], default: 'online' },
//     },
//   ],
//   remarks: { type: String },
// });

// module.exports = mongoose.model('Interviewer', interviewerSchema);



const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Availability date is required'],
    validate: {
      validator: (value) => !isNaN(new Date(value).getTime()), // Validates the date format
      message: 'Invalid date format',
    },
  },
  time: {
    type: String,
    required: [true, 'Availability time is required'],
    validate: {
      validator: (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value), // Validates HH:mm format
      message: 'Invalid time format, use HH:mm',
    },
  },
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
    validate: {
      validator: (value) => Intl.DateTimeFormat().resolvedOptions().timeZone === value || value.includes('/'),
      message: 'Invalid timezone format',
    },
  },
  mode: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online',
    required: true,
  },
});

const interviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+@.+\..+/, 'Invalid email address'],
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^\d{10}$/, 'Contact number must be 10 digits'],
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
  },
  availability: {
    type: [availabilitySchema],
    validate: {
      validator: (value) => value.length > 0,
      message: 'At least one availability slot is required',
    },
  },
  remarks: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Interviewer', interviewerSchema);
