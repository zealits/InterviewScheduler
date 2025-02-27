import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  TextField,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  UserCheck,
  CalendarDays,
  Clock,
  Calendar,
} from "lucide-react";
import axios from "axios";
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import InterviewerDetails from "./InterviewerDetails";
import Popup from "../../model/popup";

const localizer = momentLocalizer(moment);

const CustomBigCalendar = () => {
  // const CalendarComponent = React.lazy(() => import("Calender"));
  // Track the current view (week, day, or month)
  const [currentView, setCurrentView] = useState("week");
  const [popup, setPopup] = useState({ show: false, message: "" });
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDateInterviewers, setSelectedDateInterviewers] = useState([]);
  const [adminEmail, setAdminEmail] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filter, setFilter] = useState({ name: "", specialization: [] });
  const [showPopup, setShowPopup] = useState(null);
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    interviewerEmail: "",
    adminEmail: "",
    interviewerName: "",
    candidateLinkedIn: "",
    jobTitle: "",
    timeZone: "",
    jobDescription: "",
    resume: "",
    scheduledDate: "",
    interviewStartTime: "",
    interviewEndTime: "",
    specialization: "",
    startTime: "",
    endTime: "",
  });

  const interviewersListRef = useRef(null);

  const handleClosePopup = () => {
    setPopup({ show: false, message: "" });
  };

  useEffect(() => {
    const fetchAdminEmail = async () => {
      const token = localStorage.getItem("adminAuthToken");
      const adminEmail = localStorage.getItem("adminEmail"); // Fetch inside function

      if (!token || !adminEmail) {
        console.error("Missing admin token or admin ID in localStorage");
        return;
      }

      try {
        const response = await axios.get(
          `/api/admin/${adminEmail}/admin-email`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("adminnnn", response.data.email);

        if (response.data?.email) {
          setAdminEmail(response.data.email);
          localStorage.setItem("adminEmail", response.data.email); // Store for future use
        } else {
          console.error("Admin email not found in response");
        }
      } catch (error) {
        console.error(
          "Error fetching admin email:",
          error.response?.data || error.message
        );
      }
    };

    fetchAdminEmail();
  }, []);

  // --- Helper Functions ---
  const parseTimeString = (timeInput) => {
    if (timeInput instanceof Date) {
      return [timeInput.getHours(), timeInput.getMinutes()];
    }
    if (typeof timeInput === "string" && timeInput.includes(":")) {
      const m = moment(timeInput, ["h:mm A", "H:mm"]);
      if (m.isValid()) {
        return [m.hour(), m.minute()];
      }
      const parts = timeInput.split(" ");
      const timePart = parts[0];
      const [hours, minutes] = timePart.split(":").map(Number);
      return [hours, minutes];
    }
    console.error("Invalid time input:", timeInput);
    return [0, 0];
  };

  const getUserAvailabilityForDate = (user, date) => {
    const dateString = date.toISOString().slice(0, 10);
    const customEntry = user.customAvailability?.find((entry) =>
      entry.dates.some(
        (d) => new Date(d).toISOString().slice(0, 10) === dateString
      )
    );
    const rangeEntry = user.availabilityRange?.find(
      (range) =>
        new Date(range.startDate) <= date && new Date(range.endDate) >= date
    );
    const startTime = customEntry
      ? customEntry.startTime
      : rangeEntry
      ? rangeEntry.startTime
      : "Not Specified";
    const endTime = customEntry
      ? customEntry.endTime
      : rangeEntry
      ? rangeEntry.endTime
      : "Not Specified";
    const timeZone = customEntry
      ? customEntry.timezone
      : rangeEntry
      ? rangeEntry.timezone
      : "Not Specified";
    return { startTime, endTime, timeZone };
  };

  // --- Data Fetching and Event Creation ---
  useEffect(() => {
    const formatLocalDate = (dateInput) => {
      const d = new Date(dateInput);
      return d.toLocaleDateString("en-CA");
    };

    const fetchData = async () => {
      const token = localStorage.getItem("adminAuthToken");
      try {
        const response = await axios.get("/api/user/availability", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Availability Data:", response.data);

        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const eventMap = new Map();

        data.forEach((user) => {
          const customDates =
            user.customAvailability?.flatMap((entry) =>
              entry.dates.map((date) => formatLocalDate(date))
            ) || [];

          const rangeDates =
            user.availabilityRange?.flatMap((range) => {
              if (!range.startDate || !range.endDate) return [];

              let current = moment(range.startDate).startOf("day");
              const endDate = moment(range.endDate).startOf("day");

              const datesArray = [];
              while (current.isSameOrBefore(endDate, "day")) {
                datesArray.push(formatLocalDate(current));
                current.add(1, "day");
              }
              return datesArray;
            }) || [];

          [...customDates, ...rangeDates].forEach((date) => {
            if (!eventMap.has(date)) eventMap.set(date, []);
            eventMap.get(date).push(user);
          });
        });

        const combinedEvents = Array.from(eventMap.entries())
          .filter(([date, users]) => users.length > 0)
          .map(([date, users]) => {
            const eventDate = moment(date, "YYYY-MM-DD").toDate();
            const { startTime, endTime } = getUserAvailabilityForDate(
              users[0],
              eventDate
            );

            let eventStart = eventDate;
            let eventEnd = eventDate;
            let availability = "Not Specified";

            if (startTime !== "Not Specified" && endTime !== "Not Specified") {
              const [startHour, startMinute] = parseTimeString(startTime);
              const [endHour, endMinute] = parseTimeString(endTime);
              eventStart = moment(eventDate)
                .set({ hour: startHour, minute: startMinute })
                .toDate();
              eventEnd = moment(eventDate)
                .set({ hour: endHour, minute: endMinute })
                .toDate();
              availability = `${startTime} - ${endTime}`;
            }

            return {
              title: `${users.length}`, // this is the count displayed on the calendar
              start: eventStart,
              end: eventEnd,
              users,
              availability,
            };
          })
          // Filter out events that are in the past
          .filter((event) =>
            moment(event.start).isSameOrAfter(moment().startOf("day"))
          );

        setEvents(combinedEvents);
        setFilteredEvents(combinedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPopup({ show: true, message: "Failed to fetch calendar data." });
      }
    };

    fetchData();
  }, []);

  // --- Handlers ---
  const handleSelectSlot = (slotInfo) => {
    const clickedDate = moment(slotInfo.start).startOf("day").toDate();

    // Prevent past dates from being selected
    if (moment(clickedDate).isBefore(moment().startOf("day"))) {
      setSelectedDate(null);
      setSelectedDateInterviewers([]); // Clear the interviewers list
      return;
    }

    setSelectedDate(clickedDate);

    const selectedDateString = moment(clickedDate).format("YYYY-MM-DD");

    const eventsOnDate = filteredEvents.filter(
      (event) => moment(event.start).format("YYYY-MM-DD") === selectedDateString
    );

    const interviewersOnDate = eventsOnDate
      .flatMap((event) =>
        event.users.map((user) => {
          // Look for a custom availability entry that has the selected date in its dates array
          const customEntry = user.customAvailability?.find((entry) =>
            entry.dates.some(
              (date) => moment(date).format("YYYY-MM-DD") === selectedDateString
            )
          );

          // Look for an availability range that covers the clicked date
          const rangeEntry = user.availabilityRange?.find(
            (range) =>
              moment(range.startDate).isSameOrBefore(clickedDate, "day") &&
              moment(range.endDate).isSameOrAfter(clickedDate, "day")
          );

          if (!customEntry && !rangeEntry) {
            return null; // Skip users who are not available on the selected date
          }

          const startTime = customEntry
            ? customEntry.startTime
            : rangeEntry
            ? rangeEntry.startTime
            : "Not Specified";

          const endTime = customEntry
            ? customEntry.endTime
            : rangeEntry
            ? rangeEntry.endTime
            : "Not Specified";

          const timeZone = customEntry
            ? customEntry.timezone
            : rangeEntry
            ? rangeEntry.timezone
            : "Not Specified";

          return {
            name: user.name,
            specialization: user.specialization,
            availableTime: `${startTime} - ${endTime}`,
            timeZone,
            experience: user.yearOfExperience
              ? `${user.yearOfExperience} years`
              : "N/A",
            startTime,
            endTime,
            user,
          };
        })
      )
      .filter(Boolean); // Remove null values

    setSelectedDateInterviewers(interviewersOnDate);

    setFormData((prev) => ({
      ...prev,
      startTime:
        interviewersOnDate.length > 0
          ? interviewersOnDate[0].startTime
          : "Not Specified",
      endTime:
        interviewersOnDate.length > 0
          ? interviewersOnDate[0].endTime
          : "Not Specified",
      timeZone:
        interviewersOnDate.length > 0
          ? interviewersOnDate[0].timeZone
          : "Not Specified",
    }));

    if (interviewersListRef.current) {
      interviewersListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewDetails = (candidate) => {
    // Ensure selected date is not in the past
    if (
      selectedDate &&
      moment(selectedDate).isBefore(moment().startOf("day"))
    ) {
      setSelectedCandidate(null);
      setFormData({
        interviewerName: "",
        interviewerEmail: "",
        scheduledDate: "",
        specialization: "",
        startTime: "",
        endTime: "",
        timeZone: "",
      });
      return;
    }

    setSelectedCandidate(candidate);
    setFormData((prev) => ({
      ...prev,
      interviewerName: candidate?.name || "",
      interviewerEmail: candidate?.user?.email || "",
      scheduledDate: selectedDate
        ? moment(selectedDate).format("YYYY-MM-DD")
        : "",
      specialization: candidate?.specialization || "",
      startTime: candidate?.startTime || "",
      endTime: candidate?.endTime || "",
      timeZone: candidate?.timeZone || "",
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    if (value === "All") {
      setFilteredEvents(events);
      setSelectedDateInterviewers([]);
      return;
    }

    const predefinedSpecializations = ["Cloud", "AI", "Language", "Domain"];
    const filterValue = value.trim().toLowerCase();

    console.log("Selected Filter Value:", value);
    console.log("Events Data:", events);

    const filtered = events
      .map((event) => {
        if (!event.users || event.users.length === 0) return null; // Ensure users exist

        console.log(
          "Checking Event Users:",
          event.users.map((u) => u.specialization || "No Specialization")
        );

        const filteredUsers = event.users.filter((user) => {
          // Convert user.specialization to an array of strings
          let userSpecs = [];
          if (Array.isArray(user.specialization)) {
            userSpecs = user.specialization.map((spec) =>
              spec.trim().toLowerCase()
            );
          } else if (typeof user.specialization === "string") {
            // In case the string contains comma-separated values
            userSpecs = user.specialization
              .split(",")
              .map((s) => s.trim().toLowerCase());
          } else {
            return false;
          }

          if (value === "Others") {
            // Consider user as "Others" if none of their specs match the predefined ones
            return userSpecs.every(
              (spec) =>
                !predefinedSpecializations
                  .map((s) => s.toLowerCase())
                  .includes(spec)
            );
          }

          // Otherwise, return true if any of the user's specializations match the filter
          return userSpecs.includes(filterValue);
        });

        console.log(`Users matching "${value}":`, filteredUsers);

        return filteredUsers.length > 0
          ? {
              ...event,
              users: filteredUsers,
              title: `${filteredUsers.length}`,
            }
          : null;
      })
      .filter(Boolean); // Remove null values

    console.log("Final Filtered Events:", filtered);
    setFilteredEvents(filtered);

    // **Handle Interviewers for the Selected Date**
    if (selectedDate) {
      const selectedDateString = selectedDate.toISOString().split("T")[0];

      const eventsOnDate = filtered.filter(
        (event) =>
          event.start &&
          event.start.toISOString().split("T")[0] === selectedDateString
      );

      console.log("Events on Selected Date:", eventsOnDate);

      const interviewersOnDate = eventsOnDate.flatMap((event) =>
        event.users.map((user) => {
          const customEntry = user.customAvailability?.find((entry) =>
            entry.dates.some(
              (date) =>
                new Date(date).toISOString().split("T")[0] ===
                selectedDateString
            )
          );

          const rangeEntry = user.availabilityRange?.find(
            (range) =>
              new Date(range.startDate) <= selectedDate &&
              new Date(range.endDate) >= selectedDate
          );

          const startTime =
            customEntry?.startTime || rangeEntry?.startTime || "Not Specified";
          const endTime =
            customEntry?.endTime || rangeEntry?.endTime || "Not Specified";
          const timeZone =
            customEntry?.timezone || rangeEntry?.timezone || "Not Specified";

          return {
            name: user.name,
            specialization: user.specialization || "Unknown",
            availableTime: `${startTime} - ${endTime}`,
            timeZone,
            experience: user.yearOfExperience
              ? `${user.yearOfExperience} years`
              : "N/A",
            startTime,
            endTime,
            user,
          };
        })
      );

      console.log("Interviewers on Selected Date:", interviewersOnDate);
      setSelectedDateInterviewers(interviewersOnDate);
    } else {
      setSelectedDateInterviewers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "interviewStartTime") {
        return {
          ...prev,
          interviewStartTime: value,
          interviewEndTime: "", // Reset end time when start time changes
        };
      }

      if (name === "interviewEndTime" && value <= prev.interviewStartTime) {
        return prev; // Prevent setting end time earlier than start time
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (event, resumeFile) => {
    event.preventDefault();

    const {
      candidateEmail,
      candidateName,
      interviewerEmail,
      specialization,
      interviewStartTime,
      interviewEndTime,
      candidateLinkedIn,
      jobTitle,
      jobDescription,
      scheduledDate,
      startTime,
      endTime,
    } = formData;

    // Validate required fields (include specialization now)
    if (
      !candidateEmail ||
      !candidateName ||
      !specialization ||
      !jobTitle ||
      !scheduledDate ||
      !interviewStartTime ||
      !interviewEndTime
    ) {
      console.error("Missing required fields");
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("adminAuthToken");
      if (!token) {
        console.error("No auth token found");
        setError("You are not authorized! Please log in.");
        return;
      }

      const adminEmail = localStorage.getItem("adminEmail");

      // Step 1: Fetch Admin Email
      const adminResponse = await axios.get(
        `/api/admin/${adminEmail}/admin-email`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedAdminEmail = adminResponse.data.email;
      if (!fetchedAdminEmail) {
        console.error("Admin email is not found.");
        return;
      }

      console.log("Fetched Admin Email:", fetchedAdminEmail);
      console.log("Candidate Email:", candidateEmail);

      // Step 2: Prepare Form Data
      const formDataWithFile = new FormData();
      const interviewObj = {
        email: candidateEmail.trim(),
        scheduledDate: scheduledDate.trim(),
        name: candidateName.trim(),
        jobTitle: jobTitle.trim(),
        linkedin: candidateLinkedIn.trim(),
        details: jobDescription.trim(), // Updated to match schema
        specialization: Array.isArray(specialization)
          ? specialization
          : [specialization], // Ensure it's an array
        interviewStartTime: interviewStartTime.trim(),
        interviewEndTime: interviewEndTime.trim(),
      };

      formDataWithFile.append(
        "upcomingInterviews",
        JSON.stringify([interviewObj])
      );

      if (resumeFile) {
        formDataWithFile.append("resume", resumeFile);
      }

      const encodedEmail = encodeURIComponent(interviewerEmail.trim());

      console.log("Encoded Email:", encodedEmail);

      // Step 3: Submit Interview Data
      await axios.post(
        `/api/interviewers/${encodedEmail}/upcoming-interviews`,
        formDataWithFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 4: Send Emails (Admin & Interviewer)
      const emailPromises = [
        axios.post(`/api/email/send-email`, {
          recipient: fetchedAdminEmail,
          subject: `New Interview Scheduled for ${candidateName}`,
          candidateName,
          interviewerEmail, //
          jobTitle,
          scheduledDate,
          interviewStartTime,
          interviewEndTime,
          specialization,
          jobDescription,
          candidateLinkedIn,
        }),

        axios.post(`/api/email/send-email`, {
          recipient: interviewerEmail,
          subject: `You have new Interview Scheduled for ${candidateName}`,
          candidateName,
          interviewerEmail,
          jobTitle,
          scheduledDate,
          interviewStartTime,
          interviewEndTime,
          specialization,
          jobDescription,
          candidateLinkedIn,
        }),
      ];

      // Trigger emails without blocking the user response
      Promise.allSettled(emailPromises).then((results) => {
        console.log("Emails processed:", results);
      });

      setPopup({ show: true, message: "Interview scheduled successfully!" });
      setShowPopup(true);
    } catch (error) {
      console.error(
        "Error submitting details:",
        error.response?.data || error.message
      );
      setPopup({ show: true, message: "Failed to schedule interview." });
      setShowPopup(false);
    }
  };

  // --- Render ---
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#808080",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 8,
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 1280,
          mx: "auto",
          p: 0,
          mb: 4,
          borderRadius: { xs: 2, md: 3 },
          bgcolor: "#ffffff",
          boxShadow: "0 20px 60px -15px rgba(0,0,0,0.1)",
          overflow: "hidden",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 25px 70px -15px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* Header Section - Free Speech Blue gradient */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #191970 0%, #003366 50%, #000080 100%)",
            p: { xs: 3.5, md: 4.5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            position: "relative",
          }}
        >
          <CalendarDays
            size={42}
            color="#ffffff"
            style={{
              filter: "drop-shadow(0 3px 6px rgba(0,82,204,0.3))",
              opacity: 0.95,
            }}
          />
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              color: "#ffffff",
              textShadow: "0 2px 4px rgba(0,0,0,0.15)",
              letterSpacing: "0.01em",
              fontFamily: "'Inter', 'Roboto', sans-serif",
            }}
          >
            Interviewer Availability Calendar
          </Typography>
        </Box>

        {/* Filter Section - Refined professional styling */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            m: { xs: 2.5, md: 3.5 },
            borderRadius: 2,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
            },
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="medium">
                <InputLabel sx={{ color: "#4a5568", fontWeight: 500 }}>
                  Filter by Specialization
                </InputLabel>
                <Select
                  name="specialization"
                  value={filter.specialization}
                  onChange={handleFilterChange}
                  label="Filter by Specialization"
                  sx={{
                    color: "#2d3748",
                    fontWeight: 500,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e2e8f0",
                      borderWidth: "1.5px",
                      transition: "all 0.2s ease",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0052cc",
                      borderWidth: "1.5px",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0052cc",
                      borderWidth: "2px",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#4a5568",
                      transition: "transform 0.2s ease",
                    },
                    "&:hover .MuiSvgIcon-root": {
                      transform: "translateY(-1px)",
                      color: "#0052cc",
                    },
                  }}
                >
                  <MenuItem value="">All Specializations</MenuItem>
                  <MenuItem value="Cloud">Cloud</MenuItem>
                  <MenuItem value="AI">AI</MenuItem>
                  <MenuItem value="Language">Language</MenuItem>
                  <MenuItem value="Domain">Domain</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Enhanced Calendar Box - Professional styling */}
        <Box
          sx={{
            mx: { xs: 2.5, md: 3.5 },
            mb: 3.5,
            bgcolor: "#ffffff",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            boxShadow: "0 6px 30px rgba(0,0,0,0.04)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 35px rgba(0,0,0,0.06)",
            },
          }}
        >
          <Box
            sx={{
              height: { xs: 650, md: 750 },
              p: { xs: 2, md: 3 },
              overflowX: "auto",
              "& .rbc-calendar": {
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                color: "#2d3748",
                fontFamily: "'Inter', 'Roboto', sans-serif",
                backgroundColor: "#ffffff",
              },
              "& .rbc-toolbar": {
                marginBottom: "1.75rem",
                "& button": {
                  color: "#4a5568",
                  borderColor: "#e2e8f0",
                  fontSize: "0.925rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#f7fafc",
                    borderColor: "#0052cc",
                    transform: "translateY(-1px)",
                    color: "#0052cc",
                  },
                  "&.rbc-active": {
                    backgroundColor: "#0052cc",
                    borderColor: "#0052cc",
                    color: "#ffffff",
                    boxShadow: "0 3px 8px rgba(0,82,204,0.15)",
                  },
                },
              },
              "& .rbc-header": {
                padding: "14px 8px",
                fontWeight: 600,
                background: "#f7fafc",
                borderBottom: "1px solid #e2e8f0",
                color: "#4a5568",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              },
              "& .rbc-month-view": {
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
              },
              "& .rbc-day-bg": {
                borderRight: "1px solid #e2e8f0",
                borderBottom: "1px solid #e2e8f0",
                transition: "background-color 0.2s",
                "&:hover": { backgroundColor: "#f7fafc" },
              },
              "& .rbc-today": {
                backgroundColor: "rgba(0,82,204,0.08)",
                border: "1px solid rgba(0,82,204,0.15)",
              },
              "& .rbc-off-range-bg": {
                backgroundColor: "#f7fafc",
              },
              "& .rbc-date-cell": {
                padding: "10px",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "#4a5568",
                "&.rbc-now": { color: "#0052cc", fontWeight: 700 },
              },
              "& .rbc-event": {
                backgroundColor: "#0052cc",
                borderRadius: "20px",
                color: "#ffffff",
                fontWeight: 500,
                boxShadow: "0 3px 6px rgba(0,82,204,0.15)",
                border: "none",
                padding: "4px 10px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#0046ad",
                  transform: "translateY(-1px) scale(1.02)",
                  boxShadow: "0 4px 8px rgba(0,82,204,0.2)",
                },
              },
            }}
          >
            <BigCalendar
              localizer={localizer}
              events={filteredEvents.map((event) => ({
                ...event,
                title: event.title,
              }))}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              defaultView="month"
              views={["month", "week", "day"]}
              onView={(view) => setCurrentView(view)}
              components={{
                event: ({ event }) => (
                  <Box
                    onClick={() => handleSelectSlot({ start: event.start })}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { opacity: 0.9 },
                    }}
                  >
                    <Box
                      sx={{
                        alignItems: "center",
                        gap: 1,
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <CheckCircle size={14} />
                      <Typography variant="body2" fontWeight="600" noWrap>
                        {event.title}
                      </Typography>
                    </Box>
                  </Box>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Selected Date Section - Professional styling */}
        {selectedDate && (
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{
              mt: 3,
              mb: 2,
              px: 3,
              color: "#0052cc",
              borderLeft: "4px solid #0052cc",
              pl: 2,
              ml: { xs: 2, md: 3 },
            }}
          >
            Schedule of {moment(selectedDate).format("DD MMMM YYYY")}
          </Typography>
        )}

        {/* No Interviewers Message - Elegant empty state */}
        {selectedDateInterviewers.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              py: { xs: 6, md: 7 },
              mx: { xs: 2.5, md: 3.5 },
              mb: 3.5,
              bgcolor: "#ffffff",
              borderRadius: 2,
              boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
              border: "1px solid #e2e8f0",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
              },
            }}
          >
            <UserCheck size={65} color="#0052cc" style={{ opacity: 0.9 }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2.5,
                color: "#2d3748",
                fontWeight: 600,
              }}
            >
              No Interviewers available on this date
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: "#4a5568",
                maxWidth: "80%",
              }}
            >
              Please select a different date from the calendar to see available
              interviewers
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={4}
            sx={{ mt: 2, px: { xs: 2, md: 4 }, mb: 5 }}
            ref={interviewersListRef}
          >
            {selectedDateInterviewers.map((interviewer, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: { xs: 3.5, md: 4 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    border: "1px solid #eeeeee",
                    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
                    transition: "all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                      borderColor: "#e6e6e6",
                    },
                  }}
                  elevation={0}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        bgcolor: "#eef5ff",
                        p: 1.4,
                        borderRadius: "14px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <UserCheck size={26} color="#0052cc" />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{
                        color: "#2c3e50",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {interviewer.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      py: 0.5,
                      px: 0.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(245, 247, 250, 0.7)",
                      border: "1px solid rgba(230, 235, 240, 0.8)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#546e7a",
                        fontWeight: 500,
                        mb: 1.5,
                        px: 1.5,
                        pt: 1.5,
                      }}
                    >
                      Specialization
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        px: 1.5,
                        pb: 1.5,
                      }}
                    >
                      {/* Ensure specialization is always an array and map through it */}
                      {(Array.isArray(interviewer.specialization)
                        ? interviewer.specialization
                        : [interviewer.specialization]
                      ).map((spec, index) => (
                        <Box
                          key={index}
                          component="span"
                          sx={{
                            bgcolor: "#0052cc",
                            borderRadius: 10,
                            px: 1.5,
                            py: 0.6,
                            color: "#ffffff",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            boxShadow: "0 2px 8px rgba(0,82,204,0.25)",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          {spec}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: "rgba(0,82,204,0.1)",
                          borderRadius: 1.5,
                          display: "flex",
                        }}
                      >
                        <Clock size={18} color="#0052cc" />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#455a64",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontWeight: 500,
                        }}
                      >
                        <strong>Experience:</strong> {interviewer.experience}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: "rgba(0,82,204,0.1)",
                          borderRadius: 1.5,
                          display: "flex",
                        }}
                      >
                        <Calendar size={18} color="#0052cc" />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#455a64",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontWeight: 500,
                          flexWrap: "wrap",
                        }}
                      >
                        <strong>Availability:</strong>{" "}
                        {interviewer.availableTime}{" "}
                        <Box
                          component="span"
                          sx={{
                            opacity: 0.9,
                            fontSize: "0.85rem",
                            bgcolor: "#f5f5f5",
                            borderRadius: 10,
                            px: 1.5,
                            py: 0.4,
                            color: "#546e7a",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          {interviewer.timeZone}
                        </Box>
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 1.5,
                      textTransform: "none",
                      borderRadius: 2,
                      bgcolor: "#0052cc",
                      color: "#ffffff",
                      fontWeight: 600,
                      py: 1.5,
                      boxShadow: "0 8px 20px rgba(0,82,204,0.18)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#0046ad",
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px rgba(0,82,204,0.25)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                        boxShadow: "0 5px 15px rgba(0,82,204,0.2)",
                      },
                    }}
                    startIcon={<CheckCircle size={20} color="#ffffff" />}
                    onClick={() => handleViewDetails(interviewer)}
                  >
                    Schedule Interview
                  </Button>
                </Paper>
              </Grid>
            ))}
            {popup?.show && (
              <Popup message={popup.message} onClose={handleClosePopup} />
            )}
          </Grid>
        )}

        {/* Interviewer Details Modal - Keeping the same functionality */}
        <InterviewerDetails
          selectedCandidate={selectedCandidate}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          closeDetails={() => setSelectedCandidate(null)}
        />
      </Paper>
    </Box>
  );
};

export default CustomBigCalendar;
