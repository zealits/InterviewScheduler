const User = require("../models/User");

const getAvailabilityForCalendar = async (req, res) => {
  try {
    // Fetch all user data
    const users = await User.find(
      {},
      "name email linkedinProfile yearOfExperience experienceAsInterviewer specialization availabilityRange customAvailability upcomingInterviews"
    );

    // Map user data to include availability and interview details
    const userDetails = users.map((user) => ({
      name: user.name,
      email: user.email,
      linkedinProfile: user.linkedinProfile,
      yearOfExperience: user.yearOfExperience,
      experienceAsInterviewer: user.experienceAsInterviewer,
      specialization: user.specialization,
      availabilityRange: user.availabilityRange,
      customAvailability: user.customAvailability,
      upcomingInterviews: user.upcomingInterviews,
      availabilityEvents: [
        // Availability Range Events
        ...user.availabilityRange.map((range) => ({
          title: "Available",
          start: range.startDate,
          end: range.endDate,
          extendedProps: {
            startTime: range.startTime,
            endTime: range.endTime,
            specialization: user.specialization,
          },
          backgroundColor: "lightgreen",
          borderColor: "green",
        })),
        // Custom Availability Events
        ...user.customAvailability.flatMap((entry) =>
          entry.dates.map((date) => ({
            title: "Custom Availability",
            start: date,
            extendedProps: {
              specialization: user.specialization,
            },
            backgroundColor: "lightblue",
            borderColor: "blue",
          }))
        ),
        // Upcoming Interview Events
        ...user.upcomingInterviews.map((interview) => ({
          title: `Interview: ${interview.email}`,
          start: interview.scheduledDate,
          extendedProps: {
            details: interview.details,
            specialization: user.specialization,
          },
          backgroundColor: "lightcoral",
          borderColor: "red",
        })),
      ],
    }));

    // Respond with all user data including availability and events
    res.status(200).json({ data: userDetails });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Failed to fetch availability data." });
  }
};

module.exports = { getAvailabilityForCalendar };
