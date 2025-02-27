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
import { CheckCircle, UserCheck, CalendarDays } from "lucide-react";
import axios from "axios";
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import InterviewerDetails from "./InterviewerDetails";

const localizer = momentLocalizer(moment);

const CustomBigCalendar = () => {
  // Track the current view (week, day, or month)
  const [currentView, setCurrentView] = useState("week");
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
                datesArray.push(formatLocalDate(current)); // Ensure local format
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
              title: `${users.length}`,
              start: eventStart,
              end: eventEnd,
              users,
              availability,
            };
          });

        setEvents(combinedEvents);
        setFilteredEvents(combinedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch calendar data.");
      }
    };

    fetchData();
  }, []);

  // --- Handlers ---
  const handleSelectSlot = (slotInfo) => {
    const clickedDate = moment(slotInfo.start).startOf("day").toDate();
    setSelectedDate(clickedDate);

    const selectedDateString = moment(clickedDate).format("YYYY-MM-DD");

    const eventsOnDate = filteredEvents.filter(
      (event) => moment(event.start).format("YYYY-MM-DD") === selectedDateString
    );

    const interviewersOnDate = eventsOnDate.flatMap((event) =>
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

        // Use the timezone from customEntry if available, otherwise from rangeEntry
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
    );

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

      // scheduledTime: candidate
      //   ? `${candidate.startTime} - ${candidate.endTime}`
      //   : "",
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    if (!events || events.length === 0) return; // Prevent filtering empty data

    const predefinedSpecializations = ["Cloud", "AI", "Language", "Domain"];

    // **Filter events based on specialization**
    const filtered = events
      .map((event) => {
        const filteredUsers =
          value === "Others"
            ? event.users.filter(
                (user) =>
                  user.specialization &&
                  !predefinedSpecializations.includes(user.specialization)
              )
            : value
            ? event.users.filter(
                (user) => user.specialization && user.specialization === value
              )
            : event.users;

        return filteredUsers.length > 0
          ? {
              ...event,
              users: filteredUsers,
              title: `${filteredUsers.length}`,
            }
          : null;
      })
      .filter(Boolean); // Remove null values

    setFilteredEvents(filtered);

    // **Handle Interviewers for the Selected Date**
    if (selectedDate) {
      const selectedDateString = selectedDate.toISOString().slice(0, 10);

      const eventsOnDate = filtered.filter(
        (event) => event.start.toISOString().slice(0, 10) === selectedDateString
      );

      const interviewersOnDate = eventsOnDate.flatMap((event) =>
        event.users.map((user) => {
          const customEntry = user.customAvailability?.find((entry) =>
            entry.dates.some(
              (date) =>
                new Date(date).toISOString().slice(0, 10) === selectedDateString
            )
          );

          const rangeEntry = user.availabilityRange?.find(
            (range) =>
              new Date(range.startDate) <= selectedDate &&
              new Date(range.endDate) >= selectedDate
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
          interviewEndTime: "" // Reset end time when start time changes
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
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("adminAuthToken");
      if (!token) {
        console.error("No auth token found");
        alert("You are not authorized! Please log in.");
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

      await Promise.allSettled(emailPromises);

      alert("Interview scheduled successfully! Emails sent.");
      setShowPopup(true);
    } catch (error) {
      console.error(
        "Error submitting details:",
        error.response?.data || error.message
      );
      alert("Failed to schedule interview. Please try again.");
      setShowPopup(false);
    }
  };

  // --- Render ---
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#ffffff",
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
          borderRadius: { xs: 3, md: 4 },
          bgcolor: "#ffffff",
          boxShadow: "0 20px 60px -15px rgba(0,0,0,0.07)",
          overflow: "hidden",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 25px 70px -15px rgba(0,0,0,0.09)",
          },
        }}
      >
        {/* Header Section - Elegant neutral gradient */}
        <Box
          sx={{
            background: "#1f2937",
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
            color="#10b981"
            style={{
              filter: "drop-shadow(0 3px 6px rgba(16,185,129,0.2))",
              opacity: 0.95,
            }}
          />
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              color: "#ffffff",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              letterSpacing: "0.01em",
              fontFamily: "'Inter', 'Roboto', sans-serif",
            }}
          >
            Interviewer Availability Calendar
          </Typography>
        </Box>

        {/* Filter Section - Refined neutral styling */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            m: { xs: 2.5, md: 3.5 },
            borderRadius: 3,
            bgcolor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 6px 18px rgba(0,0,0,0.03)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
            },
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="medium">
                <InputLabel sx={{ color: "#4b5563", fontWeight: 500 }}>
                  Filter by Specialization
                </InputLabel>
                <Select
                  name="specialization"
                  value={filter.specialization}
                  onChange={handleFilterChange}
                  label="Filter by Specialization"
                  sx={{
                    color: "#1f2937",
                    fontWeight: 500,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d1d5db",
                      borderWidth: "1.5px",
                      transition: "all 0.2s ease",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#9ca3af",
                      borderWidth: "1.5px",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4b5563",
                      borderWidth: "2px",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#4b5563",
                      transition: "transform 0.2s ease",
                    },
                    "&:hover .MuiSvgIcon-root": {
                      transform: "translateY(-1px)",
                      color: "#1f2937",
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

        {/* Enhanced Calendar Box - Professional neutral styling */}
        <Box
          sx={{
            mx: { xs: 2.5, md: 3.5 },
            mb: 3.5,
            bgcolor: "#ffffff",
            borderRadius: { xs: 3, md: 4 },
            overflow: "hidden",
            border: "1px solid #e5e7eb",
            boxShadow: "0 6px 30px rgba(0,0,0,0.03)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 35px rgba(0,0,0,0.04)",
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
                border: "1px solid #e5e7eb",
                color: "#1f2937",
                fontFamily: "'Inter', 'Roboto', sans-serif",
                backgroundColor: "#ffffff",
              },
              "& .rbc-toolbar": {
                marginBottom: "1.75rem",
                "& button": {
                  color: "#4b5563",
                  borderColor: "#e5e7eb",
                  fontSize: "0.925rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                    borderColor: "#9ca3af",
                    transform: "translateY(-1px)",
                    color: "#1f2937",
                  },
                  "&.rbc-active": {
                    backgroundColor: "#1f2937",
                    borderColor: "#111827",
                    color: "#ffffff",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                  },
                },
              },
              "& .rbc-header": {
                padding: "14px 8px",
                fontWeight: 600,
                background: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
                color: "#4b5563",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              },
              "& .rbc-month-view": {
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
              },
              "& .rbc-day-bg": {
                borderRight: "1px solid #e5e7eb",
                borderBottom: "1px solid #e5e7eb",
                transition: "background-color 0.2s",
                "&:hover": { backgroundColor: "#f9fafb" },
              },
              "& .rbc-today": {
                backgroundColor: "rgba(31,41,55,0.05)",
                border: "1px solid rgba(31,41,55,0.1)",
              },
              "& .rbc-off-range-bg": {
                backgroundColor: "#f9fafb",
              },
              "& .rbc-date-cell": {
                padding: "10px",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "#4b5563",
                "&.rbc-now": { color: "#1f2937", fontWeight: 700 },
              },
              "& .rbc-event": {
                backgroundColor: "#1f2937",
                borderRadius: "20px",
                color: "#ffffff",
                fontWeight: 500,
                boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                border: "none",
                padding: "4px 10px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#111827",
                  transform: "translateY(-1px) scale(1.02)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
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
              color: "#1f2937",
              borderLeft: "4px solid #0ea5e9",
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
              borderRadius: 3,
              boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
              border: "1px solid #e5e7eb",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
              },
            }}
          >
            <UserCheck size={65} color="#f43f5e" style={{ opacity: 0.9 }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2.5,
                color: "#1f2937",
                fontWeight: 600,
              }}
            >
              No Interviewers available on this date
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: "#4b5563",
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
            spacing={3}
            sx={{ mt: 1, px: { xs: 2, md: 3 }, mb: 4 }}
            ref={interviewersListRef}
          >
            {selectedDateInterviewers.map((interviewer, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        bgcolor: "#f0fdfa",
                        p: 1.2,
                        borderRadius: "50%",
                        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <UserCheck size={24} color="#10b981" />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{
                        color: "#1f2937",
                      }}
                    >
                      {interviewer.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      mt: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4b5563",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <strong>Specialization:</strong>{" "}
                      <Box
                        component="span"
                        sx={{
                          bgcolor: "#f43f5e",
                          borderRadius: 10,
                          px: 1.5,
                          py: 0.5,
                          color: "#ffffff",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          boxShadow: "0 2px 4px rgba(244,63,94,0.2)",
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {interviewer.specialization}
                      </Box>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4b5563",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <strong>Experience:</strong> {interviewer.experience}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4b5563",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <strong>Availability:</strong> {interviewer.availableTime}{" "}
                      <Box
                        component="span"
                        sx={{
                          opacity: 0.9,
                          fontSize: "0.85rem",
                          bgcolor: "#f1f5f9",
                          borderRadius: 10,
                          px: 1,
                          py: 0.3,
                          color: "#64748b"
                        }}
                      >
                        {interviewer.timeZone}
                      </Box>
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      textTransform: "none",
                      borderRadius: 2.5,
                      bgcolor: "#0ea5e9",
                      color: "#ffffff",
                      fontWeight: 600,
                      py: 1.5,
                      boxShadow: "0 6px 15px rgba(14,165,233,0.15)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "#0284c7",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(14,165,233,0.2)",
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
