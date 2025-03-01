const asyncHandler = require("express-async-handler");
const User = require("../models/User"); // Update the path based on your structure

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming 'protect' middleware adds user info to the request
  const {
    availabilityType,
    availability,
    scheduledInterviews,
    availabilityRange,
    customAvailability,
    upcomingInterviews,
    
  } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update fields if provided
  if (availabilityType) user.availabilityType = availabilityType;
  if (availability) user.availability = availability;
  if (scheduledInterviews) user.scheduledInterviews = scheduledInterviews;
  if (availabilityRange) user.availabilityRange = availabilityRange;
  if (customAvailability) user.customAvailability = customAvailability;
  if (upcomingInterviews) user.upcomingInterviews = upcomingInterviews;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

// Add a custom availability
const addCustomAvailability = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { customDate, note, startTime, endTime } = req.body; // Destructure note along with customDate

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.customAvailability.push({ customDate, note, startTime, endTime });
  await user.save();

  res.status(201).json({
    success: true,
    message: "Custom availability added",
    data: user.customAvailability,
  });
});

// Add a scheduled interview
const addScheduledInterview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { date, details } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.scheduledInterviews.push({ date, details });
  await user.save();

  res.status(201).json({
    success: true,
    message: "Scheduled interview added",
    data: user.scheduledInterviews,
  });
});

// Add an upcoming interview
const addUpcomingInterview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { email, scheduledDate, scheduledTime, details } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.upcomingInterviews.push({
    email,
    scheduledDate,
    interviewTime,
    scheduledTime,
    details,
  });
  await user.save();

  res.status(201).json({
    success: true,
    message: "Upcoming interview added",
    data: user.upcomingInterviews,
  });
});

// Delete a custom availability by ID
const deleteCustomAvailability = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { customAvailabilityId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.customAvailability = user.customAvailability.filter(
    (item) => item._id.toString() !== customAvailabilityId
  );

  await user.save();

  res.status(200).json({
    success: true,
    message: "Custom availability deleted",
    data: user.customAvailability,
  });
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  updateUserProfile,
  getUserProfile,
  addCustomAvailability,
  deleteCustomAvailability,
  addScheduledInterview,
  addUpcomingInterview,
};
