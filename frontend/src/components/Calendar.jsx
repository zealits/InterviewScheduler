import {
  Box, Typography, Button, Paper, Grid, FormControl, InputLabel, Select, MenuItem, Divider
} from "@mui/material";
import { useState, useEffect } from "react";
import { CheckCircle, UserCheck, CalendarDays } from "lucide-react"; // Import UserCheck icon
import axios from "axios";
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import InterviewerDetails from "./InterviewerDetails";

const localizer = momentLocalizer(moment);

const CustomBigCalendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDateInterviewers, setSelectedDateInterviewers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filter, setFilter] = useState({ name: "", specialization: "" });
  const [showPopup, setShowPopup] = useState(null);
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    interviewerEmail: "",
    candidateLinkedIn: "",
    jobTitle: "",
    jobDescription: "",
    resume: "",
    scheduledDate: "",

  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminAuthToken");
      try {
        const response = await axios.get("/api/user/availability", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data?.data || [];
        const eventMap = new Map();

        data.forEach((user) => {
          const dates = user.customAvailability?.flatMap((entry) => entry.dates) || [];
          const rangeDates =
            user.availabilityRange?.flatMap((range) => {
              if (!range.startDate || !range.endDate) return []; // Ensure valid data
              const startDate = new Date(range.startDate);
              const endDate = new Date(range.endDate);
              const rangeDatesArray = [];
              for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
                rangeDatesArray.push(new Date(d).toISOString().slice(0, 10));
              }
              return rangeDatesArray;
            }) || [];


          [...dates, ...rangeDates].forEach((date) => {
            if (!eventMap.has(date)) {
              eventMap.set(date, []);
            }
            eventMap.get(date).push(user);
          });
        });

        const allEvents = Array.from(eventMap.entries()).map(([date, users]) => ({
          title: `${users.length}`,
          start: new Date(date),
          end: new Date(date),
          users,
        }));

        setEvents(allEvents);
        setFilteredEvents(allEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch calendar data.");
      }
    };

    fetchData();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    const clickedDate = slotInfo.start;
    setSelectedDate(clickedDate);

    const eventsOnDate = filteredEvents.filter(
      (event) => event.start.toISOString().slice(0, 10) === clickedDate.toISOString().slice(0, 10)
    );

    const interviewersOnDate = eventsOnDate.flatMap((event) =>
      event.users.map((user) => ({
        name: `${user.name}`,
        specialization: user.specialization,
        availableTime:
          user.availabilityRange?.map((range) => `${range.startTime} - ${range.endTime}`).join(", ") ||
          "Not Specified",
        experience: user.yearOfExperience ? `${user.yearOfExperience} years` : "N/A",
        user,
      }))
    );

    setSelectedDateInterviewers(interviewersOnDate);
    setSelectedCandidate(null);
  };




  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData((prev) => ({
      ...prev,
      interviewerEmail: candidate?.user?.email || "",
      scheduledDate: selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : "",
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    const filtered = events.map((event) => {
      const filteredUsers = value
        ? event.users.filter((user) => user.specialization === value)
        : event.users;

      return filteredUsers.length > 0
        ? { ...event, users: filteredUsers, title: filteredUsers.length }
        : null;
    }).filter(Boolean);

    setFilteredEvents(filtered);

    // Update the interviewers list based on selected date and filter
    if (selectedDate) {
      const eventsOnDate = filtered.filter(
        (event) => event.start.toISOString().slice(0, 10) === selectedDate.toISOString().slice(0, 10)
      );

      const interviewersOnDate = eventsOnDate.flatMap((event) =>
        event.users
          .filter((user) => !value || user.specialization === value) // Ensure only filtered specialization appears
          .map((user) => ({
            name: user.name,
            specialization: user.specialization,
            availableTime:
              user.availabilityRange?.map((range) => `${range.startTime} - ${range.endTime}`).join(", ") ||
              "Not Specified",
            experience: user.yearOfExperience ? `${user.yearOfExperience} years` : "N/A",
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
      candidateLinkedIn,
      jobTitle,
      jobDescription,
      scheduledDate,
    } = formData;
  
    // Basic validation – you may enhance this as needed
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
  
    // Create a FormData instance to send multipart/form-data
    const formDataWithFile = new FormData();
  
    // Build the interview object
    const interviewObj = {
      email: candidateEmail.trim(),
      scheduledDate: scheduledDate.trim(),
      name: candidateName.trim(),
      jobTitle: jobTitle.trim(),
      linkedin: candidateLinkedIn.trim(),
      jobDescription: jobDescription.trim(),
    };
  
    // Append the interview array (as a JSON string) so the backend gets "upcomingInterviews"
    formDataWithFile.append("upcomingInterviews", JSON.stringify([interviewObj]));
  
    // Append the resume file if it exists
    if (resumeFile) {
      formDataWithFile.append("resume", resumeFile);
    }
  
    // Use the interviewerEmail from formData for the endpoint parameter
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
        bgcolor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
        px: 4,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 1200, mx: "auto", p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        {/* Page Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
          <CalendarDays size={30} color="#FF0000" />
          <Typography variant="h4" color="primary" fontWeight="bold">
            Interviewer Availability Calendar
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Filter Fields */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2, bgcolor: "#fafafa" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Filter by Specialization</InputLabel>
                <Select
                  name="specialization"
                  value={filter.specialization}
                  onChange={handleFilterChange}
                  label="Filter by Specialization"
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

        {/* Calendar Section */}
        <Box
          sx={{
            height: 750,
            my: 3,
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: 3,
            p: 3,
            overflowX: "auto",
            border: "1px solid #e0e0e0",
          }}
        >
          <BigCalendar
            localizer={localizer}
            events={filteredEvents.map((event) => ({
              ...event,
              title: event.users.length, // Ensuring title holds count only
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
                    px: 1.5,
                    py: 0.8,
                    fontWeight: "bold",
                    boxShadow: 2,
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectSlot({ start: event.start })}
                >
                  <UserCheck size={18} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {event.title}
                  </Typography>
                </Box>
              ),
            }}
          />
        </Box>


        {/* Interviewers Available Section */}
        {/* Display selected date title */}
        {selectedDate && (
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
            Schedule of {moment(selectedDate).format("DD MMM YYYY")}
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
              py: 4,
              bgcolor: "#f9f9f9",
              borderRadius: 2,
              boxShadow: 2,
              mt: 2,
            }}
          >
            <UserCheck size={50} color="#9e9e9e" />
            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
              No Interviewers available on this date
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {selectedDateInterviewers.map((interviewer, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: "white",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <UserCheck size={20} color="#1976d2" />
                    <Typography variant="body1" fontWeight="bold">
                      {interviewer.name}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="textSecondary">
                    <strong>Specialization:</strong> {interviewer.specialization}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Experience:</strong> {interviewer.experience}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Availability:</strong> {interviewer.availableTime}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ mt: 2, alignSelf: "flex-start" }}
                    startIcon={<CheckCircle size={18} />}
                    onClick={() => handleViewDetails(interviewer)}
                  >
                    Schedule
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}


        {/* Interviewer Details Modal (Centered Card) */}
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
