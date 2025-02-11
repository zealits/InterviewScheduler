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
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filter, setFilter] = useState({ name: "", specialization: "" });
  const [showPopup, setShowPopup] = useState(null);
  const [formData, setFormData] = useState({
    scheduledTime: "",
    candidateName: "",
    candidateEmail: "",
    interviewerEmail: "",
    interviewerName: "",
    candidateLinkedIn: "",
    jobTitle: "",
    jobDescription: "",
    resume: "",
    scheduledDate: "",
    specialization: "",
    startTime: "",
    endTime: "",
  });

  const interviewersListRef = useRef(null);

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
    return { startTime, endTime };
  };

  // --- Data Fetching and Event Creation ---
  useEffect(() => {
    const formatLocalDate = (dateInput) => {
      const d = new Date(dateInput);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const fetchData = async () => {
      const token = localStorage.getItem("adminAuthToken");
      try {
        const response = await axios.get("/api/user/availability", {
          headers: { Authorization: `Bearer ${token}` },
        });

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
              const startDate = new Date(range.startDate);
              const endDate = new Date(range.endDate);
              const datesArray = [];
              for (
                let d = new Date(startDate);
                d <= endDate;
                d.setDate(d.getDate() + 1)
              ) {
                datesArray.push(formatLocalDate(d));
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
            const [year, month, day] = date.split("-");
            const eventDate = new Date(year, month - 1, day);
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
              eventStart = new Date(
                year,
                month - 1,
                day,
                startHour,
                startMinute
              );
              eventEnd = new Date(year, month - 1, day, endHour, endMinute);
              availability = `${startTime} - ${endTime}`;
            }
            return {
              title: `${users.length} Users`,
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
    const clickedDate = slotInfo.start;
    setSelectedDate(clickedDate);

    const selectedDateString = clickedDate.toISOString().slice(0, 10);
    const eventsOnDate = filteredEvents.filter(
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
            new Date(range.startDate) <= clickedDate &&
            new Date(range.endDate) >= clickedDate
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

        return {
          name: user.name,
          specialization: user.specialization,
          availableTime: `${startTime} - ${endTime}`,
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

    if (interviewersOnDate.length > 0) {
      setFormData((prev) => ({
        ...prev,
        startTime: interviewersOnDate[0].startTime,
        endTime: interviewersOnDate[0].endTime,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        startTime: "Not Specified",
        endTime: "Not Specified",
      }));
    }
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
      scheduledTime: candidate
        ? `${candidate.startTime} - ${candidate.endTime}`
        : "",
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    const filtered = events
      .map((event) => {
        const filteredUsers = value
          ? event.users.filter((user) => user.specialization === value)
          : event.users;
        return filteredUsers.length > 0
          ? {
              ...event,
              users: filteredUsers,
              title: `${filteredUsers.length} Users`,
            }
          : null;
      })
      .filter(Boolean);

    setFilteredEvents(filtered);

    if (selectedDate) {
      const selectedDateString = selectedDate.toISOString().slice(0, 10);
      const eventsOnDate = filtered.filter(
        (event) => event.start.toISOString().slice(0, 10) === selectedDateString
      );
      const interviewersOnDate = eventsOnDate.flatMap((event) =>
        event.users
          .filter((user) => !value || user.specialization === value)
          .map((user) => {
            const customEntry = user.customAvailability?.find((entry) =>
              entry.dates.some(
                (date) =>
                  new Date(date).toISOString().slice(0, 10) ===
                  selectedDateString
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
            return {
              name: user.name,
              specialization: user.specialization,
              availableTime: `${startTime} - ${endTime}`,
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event, resumeFile) => {
    event.preventDefault();
    const {
      candidateEmail,
      candidateName,
      interviewerEmail,
      specialization,
      candidateLinkedIn,
      jobTitle,
      jobDescription,
      scheduledDate,
      startTime,
      endTime,
    } = formData;

    if (
      !candidateEmail ||
      !candidateName ||
      !jobDescription ||
      !jobTitle ||
      !scheduledDate
    ) {
      setShowPopup(false);
      return;
    }

    const formDataWithFile = new FormData();
    const interviewObj = {
      email: candidateEmail.trim(),
      scheduledDate: scheduledDate.trim(),
      name: candidateName.trim(),
      jobTitle: jobTitle.trim(),
      linkedin: candidateLinkedIn.trim(),
      jobDescription: jobDescription.trim(),
      scheduledTime: `${startTime} - ${endTime}`,
    };
    formDataWithFile.append(
      "upcomingInterviews",
      JSON.stringify([interviewObj])
    );

    if (resumeFile) {
      formDataWithFile.append("resume", resumeFile);
    }

    const encodedEmail = interviewerEmail.trim();

    try {
      await axios.post(
        `/api/interviewers/${encodedEmail}/upcoming-interviews`,
        formDataWithFile,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setShowPopup(true);
    } catch (error) {
      console.error("Error submitting details:", error);
      setShowPopup(false);
    }
  };

  // --- Render ---
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right bottom, #f8fafc, #e2e8f0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
        px: 4,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          p: 0,
          mb: 4,
          borderRadius: 4,
          bgcolor: "#ffffff",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            p: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CalendarDays size={35} color="#ffffff" />
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#ffffff" }}>
            Interviewer Availability Calendar
          </Typography>
        </Box>

        {/* Filter Section */}
        <Paper
          sx={{
            p: 3,
            m: 3,
            borderRadius: 3,
            bgcolor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: "#2563eb" }}>
                  Filter by Specialization
                </InputLabel>
                <Select
                  name="specialization"
                  value={filter.specialization}
                  onChange={handleFilterChange}
                  label="Filter by Specialization"
                  sx={{
                    color: "#1e293b",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e5e7eb",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2563eb",
                    },
                    "& .MuiSvgIcon-root": { color: "#2563eb" },
                  }}
                >
                  <MenuItem value="">All Specializations</MenuItem>
                  <MenuItem value="Cloud">Cloud</MenuItem>
                  <MenuItem value="AI">AI</MenuItem>
                  <MenuItem value="Language">Language</MenuItem>
                  <MenuItem value="Domain">Domain</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Enhanced Calendar Box */}
        <Box
          sx={{
            mx: 3,
            mb: 3,
            bgcolor: "#ffffff",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Box
            sx={{
              height: 750,
              p: 3,
              overflowX: "auto",
              "& .rbc-calendar": {
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                color: "#1e293b",
              },
              "& .rbc-header": {
                padding: "12px 8px",
                fontWeight: "bold",
                background: "#f8fafc",
                borderBottom: "1px solid #e5e7eb",
                color: "#2563eb",
                fontSize: "0.95rem",
                textTransform: "uppercase",
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
                "&:hover": { backgroundColor: "#f1f5f9" },
              },
              "& .rbc-today": {
                backgroundColor: "#eff6ff",
                border: "1px solid #2563eb",
              },
              "& .rbc-off-range-bg": { backgroundColor: "#f8fafc" },
              "& .rbc-date-cell": {
                padding: "8px",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "#1e293b",
                "&.rbc-now": { color: "#2563eb", fontWeight: "bold" },
              },
              "& .rbc-show-more": {
                color: "#2563eb",
                fontWeight: 500,
                background: "rgba(37, 99, 235, 0.1)",
                borderRadius: "4px",
                padding: "2px 8px",
              },
              "& .rbc-event": {
                borderRadius: "6px",
                padding: "4px 8px",
                backgroundColor: "#2563eb",
                border: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&.rbc-selected": { backgroundColor: "#1d4ed8" },
              },
              "& .rbc-toolbar": {
                marginBottom: "20px",
                gap: "10px",
                "& button": {
                  color: "#2563eb",
                  borderColor: "#e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  backgroundColor: "#ffffff",
                  "&:hover": { backgroundColor: "#eff6ff" },
                  "&.rbc-active": {
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                  },
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
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 0.5,
                      px: 1,
                      py: 0.5,
                      fontWeight: "bold",
                      borderRadius: "6px",
                      background: "linear-gradient(#2563eb, #1d4ed8)",
                      color: "white",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                      },
                    }}
                    onClick={() => handleSelectSlot({ start: event.start })}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <UserCheck size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {event.title}
                      </Typography>
                    </Box>
                    
                  </Box>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Selected Date Section */}
        {selectedDate && (
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mt: 3, mb: 2, px: 3, color: "#2563eb" }}
          >
            Schedule of {moment(selectedDate).format("DD MMM YYYY")}
          </Typography>
        )}

        {/* No Interviewers Message */}
        {selectedDateInterviewers.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              py: 6,
              mx: 3,
              mb: 3,
              bgcolor: "#f8fafc",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid #e5e7eb",
            }}
          >
            <UserCheck size={60} color="#94a3b8" />
            <Typography variant="h6" sx={{ mt: 2, color: "#64748b" }}>
              No Interviewers available on this date
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={3}
            sx={{ mt: 1, px: 3, mb: 3 }}
            ref={interviewersListRef}
          >
            {selectedDateInterviewers.map((interviewer, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ bgcolor: "#eff6ff", p: 1, borderRadius: "50%" }}>
                      <UserCheck size={24} color="#2563eb" />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#1e293b" }}
                    >
                      {interviewer.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography variant="body2" sx={{ color: "#1e293b" }}>
                      <strong>Specialization:</strong>{" "}
                      <Box
                        component="span"
                        sx={{
                          bgcolor: "#eff6ff",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "full",
                          color: "#2563eb",
                          ml: 1,
                        }}
                      >
                        {interviewer.specialization}
                      </Box>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      <strong>Experience:</strong> {interviewer.experience}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      <strong>Availability:</strong> {interviewer.availableTime}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 1,
                      textTransform: "none",
                      borderRadius: 2,
                      bgcolor: "#2563eb",
                      color: "#ffffff",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                      "&:hover": {
                        bgcolor: "#1d4ed8",
                        boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
                      },
                    }}
                    startIcon={<CheckCircle size={20} />}
                    onClick={() => handleViewDetails(interviewer)}
                  >
                    Schedule Interview
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Interviewer Details Modal */}
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
