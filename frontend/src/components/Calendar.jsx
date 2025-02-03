import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CustomBigCalendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDateInterviewers, setSelectedDateInterviewers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filter, setFilter] = useState({ name: "", specialization: "" });
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    interviewerEmail: "",
    candidateLinkedIn: "",
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
          const rangeDates = user.availabilityRange?.flatMap((range) => {
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

        const allEvents = Array.from(eventMap.entries()).map(([date, users]) => {
          const start = new Date(date);
          const end = new Date(date);
          end.setHours(end.getHours() + 1);
          return {
            title: `${users.length} available`,
            start,
            end,
            users,
          };
        });

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

    const eventsOnDate = events.filter(
      (event) =>
        event.start.toISOString().slice(0, 10) ===
        clickedDate.toISOString().slice(0, 10)
    );

    const interviewersOnDate = eventsOnDate.flatMap((event) =>
      event.users.map((user) => ({
        name: `${user.name} (${user.specialization})`,
        specialization: user.specialization,
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

    const filtered = events.filter((event) => {
      return (
        (name === "name"
          ? event.users.some((user) =>
              user.name.toLowerCase().includes(value.toLowerCase())
            )
          : true) &&
        (name === "specialization"
          ? event.users.some((user) =>
              user.specialization.toLowerCase().includes(value.toLowerCase())
            )
          : true)
      );
    });
    setFilteredEvents(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      candidateEmail,
      candidateName,
      interviewerEmail,
      candidateLinkedIn,
      jobDescription,
      resume,
      scheduledDate,
    } = formData;

    if (
      !candidateEmail ||
      !candidateName ||
      !jobDescription ||
      !candidateLinkedIn ||
      !resume ||
      !scheduledDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const pdfRegex = /^(https?:\/\/.*\.(pdf))$/i;
    if (!pdfRegex.test(resume)) {
      alert("Resume must be a valid PDF link ending in .pdf.");
      return;
    }

    const payload = {
      upcomingInterviews: [
        {
          email: candidateEmail,
          interviewerEmail,
          name: candidateName,
          linkedin: candidateLinkedIn,
          resume,
          jobDescription,
          scheduledDate,
        },
      ],
    };

    const encodedEmail = encodeURIComponent(interviewerEmail);

    try {
      await axios.post(
        `/api/interviewers/${encodedEmail}/upcoming-interviews`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Candidate details submitted successfully!");
    } catch (error) {
      console.error("Error submitting details:", error);
      alert(
        "Failed to submit candidate details. " +
          (error.response?.data?.message || "Please check the console.")
      );
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 4, px: 2 }}>
      <Paper sx={{ maxWidth: 1200, mx: "auto", p: 3, mb: 4 }}>
        <Typography variant="h3" align="center" color="primary" gutterBottom>
          Interviewer Availability Calendar
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Filter by Name"
              name="name"
              value={filter.name}
              onChange={handleFilterChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Filter by Specialization"
              name="specialization"
              value={filter.specialization}
              onChange={handleFilterChange}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Box sx={{ height: 500, mb: 3 }}>
          <BigCalendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            selectable
            onSelectSlot={handleSelectSlot}
            eventPropGetter={() => ({
              style: { backgroundColor: "#1976d2", color: "white" },
            })}
          />
        </Box>

        {selectedDate && (
          <Paper sx={{ p: 3, mb: 3, bgcolor: "#e3f2fd" }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Available Interviewers on {selectedDate.toDateString()}
            </Typography>
            {selectedDateInterviewers.length > 0 ? (
              <Box component="ul" sx={{ pl: 2 }}>
                {selectedDateInterviewers.map((interviewer, index) => (
                  <Box
                    key={index}
                    component="li"
                    sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                  >
                    <Typography variant="body1">{interviewer.name}</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleViewDetails(interviewer)}
                    >
                      View Details
                    </Button>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>No interviewers available.</Typography>
            )}
          </Paper>
        )}

        {selectedCandidate && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              Candidate Details
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Interviewer Email"
                    name="interviewerEmail"
                    value={formData.interviewerEmail}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Schedule Date"
                    name="scheduledDate"
                    InputLabelProps={{ shrink: true }}
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Candidate Name"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Candidate Email"
                    name="candidateEmail"
                    value={formData.candidateEmail}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="LinkedIn Profile"
                    name="candidateLinkedIn"
                    value={formData.candidateLinkedIn}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Job Description"
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Resume (PDF link ending with .pdf)"
                    name="resume"
                    value={formData.resume}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                Submit
              </Button>
            </Box>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default CustomBigCalendar;
