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
    const dateString = moment(date).format("YYYY-MM-DD"); // Use local timezone

    const customEntry = user.customAvailability?.find((entry) =>
      entry.dates.some((d) => moment(d).format("YYYY-MM-DD") === dateString)
    );

    const rangeEntry = user.availabilityRange?.find((range) => {
      const startDate = moment(range.startDate).startOf("day");
      const endDate = moment(range.endDate).endOf("day");
      const targetDate = moment(date).startOf("day");

      return targetDate.isBetween(startDate, endDate, null, "[]");
    });

    if (!customEntry && !rangeEntry) return null;

    return {
      startTime: customEntry ? customEntry.startTime : rangeEntry.startTime,
      endTime: customEntry ? customEntry.endTime : rangeEntry.endTime,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/user/availability", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`,
          },
        });

        const usersData = response.data?.data || [];
        const eventMap = new Map();

        usersData.forEach((user) => {
          const validDates = new Set();

          user.customAvailability?.forEach((entry) =>
            entry.dates.forEach((date) =>
              validDates.add(moment(date).format("YYYY-MM-DD"))
            )
          );

          user.availabilityRange?.forEach((range) => {
            if (!range.startDate || !range.endDate) return;
            let current = moment(range.startDate).startOf("day");
            const endDate = moment(range.endDate).startOf("day");

            while (current.isSameOrBefore(endDate)) {
              validDates.add(current.format("YYYY-MM-DD"));
              current.add(1, "day");
            }
          });

          validDates.forEach((date) => {
            if (!eventMap.has(date)) eventMap.set(date, []);
            eventMap.get(date).push(user);
          });
        });

        const combinedEvents = Array.from(eventMap.entries())
          .map(([date, users]) => {
            const eventDate = moment(date, "YYYY-MM-DD").toDate();
            const availabilityData = getUserAvailabilityForDate(
              users[0],
              eventDate
            );

            if (!availabilityData) return null;

            const [startHour, startMinute] = parseTimeString(
              availabilityData.startTime
            );
            const [endHour, endMinute] = parseTimeString(
              availabilityData.endTime
            );

            return {
              title: `${users.length} `,
              start: moment(eventDate)
                .set({ hour: startHour, minute: startMinute })
                .local()
                .toDate(),
              end: moment(eventDate)
                .set({ hour: endHour, minute: endMinute })
                .local()
                .toDate(),
              users,
              availability: `${availabilityData.startTime} - ${availabilityData.endTime}`,
            };
          })
          .filter(Boolean); // Remove null values

        setEvents(combinedEvents);
        setFilteredEvents(combinedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    const clickedDate = slotInfo.start;
    setSelectedDate(clickedDate);

    const selectedDateString = clickedDate.toISOString().slice(0, 10); // Normalize date format

    const eventsOnDate = filteredEvents.filter(
      (event) => event.start.toISOString().slice(0, 10) === selectedDateString
    );

    const interviewersOnDate = eventsOnDate.flatMap((event) =>
      event.users.map((user) => {
        // Extract time from customAvailability or availabilityRange
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
        starttime: interviewersOnDate[0].startTime,
        endtime: interviewersOnDate[0].endTime,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        starttime: "Not Specified",
        endtime: "Not Specified",
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
        ? moment(selectedDate).local().format("YYYY-MM-DD")
        : "",
      specialization: candidate?.specialization || "",
      startTime: candidate?.startTime || "",
      endTime: candidate?.endTime || "",
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
              title: `${filteredUsers.length} `,
            }
          : null;
      })
      .filter(Boolean);

    setFilteredEvents(filtered);

    if (selectedDate) {
      const eventsOnDate = filtered.filter(
        (event) =>
          event.start.toISOString().slice(0, 10) ===
          selectedDate.toISOString().slice(0, 10)
      );

      const interviewersOnDate = eventsOnDate.flatMap((event) =>
        event.users
          .filter((user) => !value || user.specialization === value)
          .map((user) => ({
            name: user.name,
            specialization: user.specialization,
            availableTime:
              user.availabilityRange
                ?.map((range) => `${range.startTime} - ${range.endTime}`)
                .join(", ") || "Not Specified",
            experience: user.yearOfExperience
              ? `${user.yearOfExperience} years`
              : "N/A",
            user,
          }))
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
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setShowPopup(true);
    } catch (error) {
      console.error("Error submitting details:", error);
      setShowPopup(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right bottom, #f0f4ff, #f5f5f5)",
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
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #1976d2, #1565c0)",
            p: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CalendarDays size={35} color="#ffffff" />
          <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
            Interviewer Availability Calendar
          </Typography>
        </Box>

        <Paper
          sx={{
            p: 3,
            m: 3,
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            bgcolor: "#ffffff",
            border: "1px solid #e0e0e0",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Filter by Specialization</InputLabel>
                <Select
                  name="specialization"
                  value={filter.specialization}
                  onChange={handleFilterChange}
                  label="Filter by Specialization"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
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

        <Box
          sx={{
            mx: 3,
            mb: 3,
            bgcolor: "#ffffff",
            borderRadius: 3,
            overflow: "hidden",
            border: "2px solid #1976d2",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #2196f3, #1565c0)",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "2px solid #1976d2",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Interview Schedule
            </Typography>
          </Box>

          <Box
            sx={{
              height: 750,
              p: 3,
              overflowX: "auto",
              "& .rbc-calendar": {
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
              },
              "& .rbc-header": {
                padding: "12px 8px",
                fontWeight: "bold",
                background: "linear-gradient(to bottom, #f8f9fa, #f1f3f5)",
                borderBottom: "2px solid #1976d2",
                color: "#1976d2",
                fontSize: "0.95rem",
                textTransform: "uppercase",
              },
              "& .rbc-month-view": {
                borderRadius: 2,
                border: "1px solid #1976d2",
              },
              "& .rbc-day-bg": {
                borderRight: "1px solid #e0e0e0",
                borderBottom: "1px solid #e0e0e0",
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: "#f5f9ff",
                },
              },
              "& .rbc-today": {
                backgroundColor: "#e3f2fd",
                border: "2px solid #1976d2",
              },
              "& .rbc-off-range-bg": {
                backgroundColor: "#f8f9fa",
              },
              "& .rbc-date-cell": {
                padding: "8px",
                fontWeight: 500,
                fontSize: "0.9rem",
                "&.rbc-now": {
                  color: "#1976d2",
                  fontWeight: "bold",
                },
              },
              "& .rbc-show-more": {
                color: "#1976d2",
                fontWeight: 500,
                background: "rgba(25, 118, 210, 0.1)",
                borderRadius: "4px",
                padding: "2px 8px",
              },
              "& .rbc-event": {
                borderRadius: "6px",
                padding: "4px 8px",
                backgroundColor: "#4caf50",
                border: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&.rbc-selected": {
                  backgroundColor: "#2196f3",
                },
              },
              "& .rbc-toolbar": {
                marginBottom: "20px",
                gap: "10px",
                "& button": {
                  color: "#1976d2",
                  borderColor: "#1976d2",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                  "&.rbc-active": {
                    backgroundColor: "#1976d2",
                    color: "white",
                  },
                },
              },
              "& .rbc-month-row": {
                borderLeft: "1px solid #e0e0e0",
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
              components={{
                event: ({ event }) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1,
                      py: 0.5,
                      fontWeight: "bold",
                      borderRadius: "6px",
                      background: "linear-gradient(135deg, #4caf50, #43a047)",
                      color: "white",
                      justifyContent: "center",
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
                    <UserCheck size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {event.title}
                    </Typography>
                  </Box>
                ),
              }}
            />
          </Box>
        </Box>

        {selectedDate && (
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              mt: 3,
              mb: 2,
              px: 3,
              color: "#1976d2",
            }}
          >
            Schedule of {moment(selectedDate).local().format("DD MMM YYYY")}
          </Typography>
        )}

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
              bgcolor: "#f8faff",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid #e0e0e0",
            }}
          >
            <UserCheck size={60} color="#9e9e9e" />
            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
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
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    bgcolor: "white",
                    border: "1px solid #e0e0e0",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        bgcolor: "#f0f7ff",
                        p: 1,
                        borderRadius: "50%",
                      }}
                    >
                      <UserCheck size={24} color="#1976d2" />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {interviewer.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography variant="body2">
                      <strong>Specialization:</strong>{" "}
                      <Box
                        component="span"
                        sx={{
                          bgcolor: "#f0f7ff",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "full",
                          color: "#1976d2",
                          ml: 1,
                        }}
                      >
                        {interviewer.specialization}
                      </Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Experience:</strong> {interviewer.experience}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Availability:</strong> {interviewer.availableTime}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      mt: 1,
                      textTransform: "none",
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                      "&:hover": {
                        boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
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
