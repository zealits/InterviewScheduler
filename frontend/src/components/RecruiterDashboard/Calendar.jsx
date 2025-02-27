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
  TextField,
  IconButton,InputAdornment,Avatar
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, UserCheck, CalendarDays, Clock, Calendar, RefreshCw,BarChart3,Search,FilterIcon,Download,CalendarPlus,CalendarCheck} from "lucide-react";
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
        background: "linear-gradient(to bottom, #f8fafc, #eef2f6)",
        py: 5,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1280,
          mx: "auto",
          borderRadius: "12px",
          bgcolor: "#ffffff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Header - Refined Gradient and Spacing */}
        <Box
          sx={{
            background: "linear-gradient(90deg, #1e293b 0%, #0f172a 100%)",
            p: { xs: 2.5, sm: 3, md: 3.5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                borderRadius: "12px",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CalendarDays size={28} color="#ffffff" />
            </Box>
            
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
                  letterSpacing: "-0.01em",
                }}
              >
                Interviewer Availability
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.75)",
                  mt: 0.5,
                  display: { xs: "none", sm: "block" },
                  fontSize: { sm: "0.875rem", md: "0.9375rem" },
                  fontWeight: 500,
                }}
              >
                Schedule and manage interview slots efficiently
              </Typography>
            </Box>
          </Box>
          
         
        </Box>
  
        {/* Filter Section - Enhanced with Multiple Filters */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl 
                variant="outlined" 
                size="small" 
                sx={{ 
                  width: "100%",
                }}
              >
                <InputLabel id="specialization-label">Specialization</InputLabel>
                <Select
                  labelId="specialization-label"
                  name="specialization"
                  value={filter.specialization}
                  onChange={handleFilterChange}
                  label="Specialization"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cbd5e1",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#64748b",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1e293b",
                    },
                    borderRadius: "8px",
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
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl 
                variant="outlined" 
                size="small" 
                sx={{ 
                  width: "100%",
                }}
              >
              
             
              </FormControl>
            </Grid>
        
          </Grid>
        </Box>
  
        {/* Calendar Section - Enhanced Styling */}
        <Box sx={{ px: { xs: 2, sm: 2.5, md: 3 }, py: 3 }}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: { xs: 580, md: 650 },
                "& .rbc-calendar": {
                  fontFamily: "'Inter', 'Roboto', sans-serif",
                  color: "#1e293b",
                },
                "& .rbc-toolbar": {
                  marginBottom: 2,
                  padding: "16px 16px 8px 16px",
                  borderBottom: "1px solid #f1f5f9",
                  "& button": {
                    color: "#1e293b",
                    borderColor: "#cbd5e1",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                    padding: "6px 12px",
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                      borderColor: "#64748b",
                    },
                    "&.rbc-active": {
                      backgroundColor: "#1e293b",
                      borderColor: "#1e293b",
                      color: "#ffffff",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                    },
                  },
                },
                "& .rbc-header": {
                  padding: "14px 10px",
                  fontWeight: 600,
                  background: "#f8fafc",
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  fontSize: "0.8125rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                },
                "& .rbc-month-view, & .rbc-time-view": {
                  border: "1px solid #e2e8f0",
                  borderRadius: "0 0 12px 12px",
                  borderTop: "none",
                },
                "& .rbc-day-bg": {
                  transition: "background-color 0.2s",
                  "&:hover": { backgroundColor: "#f8fafc" },
                },
                "& .rbc-today": {
                  backgroundColor: "rgba(30, 41, 59, 0.06)",
                },
                "& .rbc-off-range-bg": {
                  backgroundColor: "#f8fafc",
                },
                "& .rbc-date-cell": {
                  padding: "8px 10px",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#475569",
                  "&.rbc-now": { 
                    color: "#1e293b", 
                    fontWeight: 700 
                  },
                },
                "& .rbc-event": {
                  backgroundColor: "#1e293b",
                  borderRadius: "6px",
                  color: "#ffffff",
                  fontWeight: 500,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  border: "none",
                  padding: "3px 8px",
                  "&:hover": {
                    backgroundColor: "#0f172a",
                    transform: "translateY(-1px)",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                  },
                },
              }}
            >
              <BigCalendar
                localizer={localizer}
                events={filteredEvents}
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
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <CheckCircle size={12} />
                      <Typography variant="body2" fontWeight="600" noWrap>
                        {event.title}
                      </Typography>
                    </Box>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Box>
  
        {/* Selected Date Section - Enhanced Cards */}
        {selectedDate && (
          <Box sx={{ px: { xs: 2, sm: 2.5, md: 3 }, pt: 1, pb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#1e293b",
                  fontWeight: 600,
                  borderLeft: "3px solid #0f172a",
                  pl: 1.5,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                Available on {moment(selectedDate).format("MMMM D, YYYY")}
              </Typography>
              
              <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1.5 }}>
              
                
              </Box>
            </Box>
  
            {selectedDateInterviewers.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  py: 6,
                  px: 3,
                  bgcolor: "#fff",
                  borderRadius: "12px",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <UserCheck size={48} color="#64748b" opacity={0.7} />
                <Typography
                  variant="h6"
                  sx={{
                    mt: 2.5,
                    color: "#1e293b",
                    fontWeight: 600,
                  }}
                >
                  No Interviewers Available
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1.5,
                    color: "#64748b",
                    maxWidth: "450px",
                    lineHeight: 1.6,
                  }}
                >
                  There are currently no interviewers available for this date. Please select a different date from the calendar to view available interviewers.
                </Typography>
                <Button
                  variant="contained"
                  size="medium"
                  sx={{
                    mt: 3,
                    textTransform: "none",
                    borderRadius: "8px",
                    bgcolor: "#1e293b",
                    color: "#ffffff",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
                    "&:hover": {
                      bgcolor: "#0f172a",
                    },
                  }}
                  startIcon={<CalendarPlus size={18} />}
                >
                  Add Availability
                </Button>
              </Paper>
            ) : (
              <Grid 
                container 
                spacing={{ xs: 2, sm: 2.5, md: 3 }} 
                ref={interviewersListRef}
              >
                {selectedDateInterviewers.map((interviewer, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 0,
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.25s ease",
                        overflow: "hidden",
                        "&:hover": {
                          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                          borderColor: "#cbd5e1",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      {/* Card Header with Gradient */}
                      <Box 
                        sx={{
                          bgcolor: "#f8fafc",
                          p: 2.5,
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            sx={{ 
                              bgcolor: "#e2e8f0",
                              color: "#1e293b",
                              width: 48,
                              height: 48,
                              fontSize: "1.1rem",
                              fontWeight: 600,
                            }}
                          >
                            {interviewer.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                color: "#0f172a",
                                fontSize: "1rem",
                              }}
                            >
                              {interviewer.name}
                            </Typography>
                            
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                              <Clock size={14} color="#64748b" />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#64748b",
                                  fontWeight: 500,
                                }}
                              >
                                {interviewer.experience}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      
                      {/* Card Content */}
                      <Box sx={{ p: 2.5 }}>
                        {/* Specialization Tags */}
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1.5,
                            color: "#475569",
                            fontWeight: 600,
                          }}
                        >
                          Specialization
                        </Typography>
                        
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2.5 }}>
                          {(Array.isArray(interviewer.specialization) 
                            ? interviewer.specialization 
                            : [interviewer.specialization]
                          ).map((spec, idx) => (
                            <Box
                              key={idx}
                              component="span"
                              sx={{
                                bgcolor: "#f1f5f9",
                                color: "#1e293b",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                px: 1.5,
                                py: 0.6,
                                borderRadius: "6px",
                                letterSpacing: "0.02em",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              {spec}
                            </Box>
                          ))}
                        </Box>
                        
                        {/* Availability */}
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1.5,
                            color: "#475569",
                            fontWeight: 600,
                          }}
                        >
                          Availability
                        </Typography>
                        
                        <Box 
                          sx={{ 
                            p: 1.5, 
                            bgcolor: "#f8fafc", 
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            mb: 3,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                            <Box 
                              sx={{ 
                                width: 6, 
                                height: 6, 
                                borderRadius: "50%", 
                                bgcolor: "#10b981",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#334155",
                                fontWeight: 500,
                              }}
                            >
                              {interviewer.availableTime}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box 
                              sx={{ 
                                width: 6, 
                                height: 6, 
                                borderRadius: "50%", 
                                bgcolor: "#transparent",
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#64748b",
                                fontWeight: 500,
                              }}
                            >
                              {interviewer.timeZone}
                            </Typography>
                          </Box>
                        </Box>
      
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            textTransform: "none",
                            borderRadius: "8px",
                            bgcolor: "#0f172a",
                            color: "#ffffff",
                            fontWeight: 600,
                            py: 1.5,
                            boxShadow: "0 8px 16px rgba(15, 23, 42, 0.15)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "#1e293b",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 20px rgba(15, 23, 42, 0.2)",
                            },
                            "&:active": {
                              transform: "translateY(0)",
                            },
                          }}
                          startIcon={<CalendarCheck size={18} />}
                          onClick={() => handleViewDetails(interviewer)}
                        >
                          Schedule Interview
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Mobile Action Buttons */}
            <Box 
              sx={{ 
                display: { xs: "flex", sm: "none" },
                gap: 2,
                mt: 3,
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Download size={16} />}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  borderColor: "#cbd5e1",
                  color: "#64748b",
                  fontWeight: 500,
                  flex: 1,
                  "&:hover": {
                    borderColor: "#64748b",
                    bgcolor: "rgba(100, 116, 139, 0.04)",
                  },
                }}
              >
                Export
              </Button>
              
              <Button
                variant="contained"
                startIcon={<CalendarPlus size={16} />}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  bgcolor: "#1e293b",
                  color: "#ffffff",
                  fontWeight: 500,
                  flex: 1,
                  "&:hover": {
                    bgcolor: "#0f172a",
                  },
                }}
              >
                Add Interviewer
              </Button>
            </Box>
          </Box>
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
