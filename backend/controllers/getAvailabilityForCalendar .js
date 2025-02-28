const User = require("../models/User");

const getAvailabilityForCalendar = async (req, res) => {
  try {
    // Fetch only the required fields from all users
    const users = await User.find(
      {},
      "name email linkedinProfile specialization customAvailability availabilityRange  yearOfExperience experienceAsInterviewer interviewTime timeZone"
    );

    // Map the data so that only the required fields are sent.
    // (You can further process or remove any fields that your frontend does not need.)
    const userDetails = users.map((user) => ({
      name: user.name,
      email: user.email,
      linkedinProfile: user.linkedinProfile,
      specialization: user.specialization,
      yearOfExperience: user.yearOfExperience,
      experienceAsInterviewer: user.experienceAsInterviewer,
      customAvailability: user.customAvailability, // Expected to be an array of entries (each with dates, startTime, endTime)
      availabilityRange: user.availabilityRange, // Expected to be an array of ranges (each with startDate, endDate, startTime, endTime)
      interviewTime: user.interviewTime,
      timeZone: user.timeZone,
        // Only include if needed for calendar events
    }));

    res.status(200).json({ data: userDetails });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Failed to fetch availability data." });
  }
};

module.exports = { getAvailabilityForCalendar };
