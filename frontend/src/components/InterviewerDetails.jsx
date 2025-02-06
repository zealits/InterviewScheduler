import { Box, Typography, Button, Paper, Grid, TextField, IconButton, Divider } from "@mui/material";
import { X, UserCheck, Send, CheckCircle } from "lucide-react"; // Import icons
import { useState } from "react";

const InterviewerDetails = ({ selectedCandidate, formData, handleChange, handleSubmit, closeDetails }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  if (!selectedCandidate) return null;

  // Function to validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.candidateName) errors.candidateName = "Candidate Name is required.";
    if (!formData.candidateEmail) errors.candidateEmail = "Candidate Email is required.";
    if (!formData.candidateLinkedIn) errors.candidateLinkedIn = "LinkedIn Profile is required.";
    if (!formData.jobDescription) errors.jobDescription = "Job Description is required.";
    if (!formData.resume) errors.resume = "Resume (PDF link) is required.";
    return errors;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Validate form data
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); // Show errors if form is not valid
      return;
    }

    // If validation passes, trigger success popup
    handleSubmit(event);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      closeDetails();
    }, 3000); // Auto close after 3 seconds
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0, 0, 0, 0.5)", // Dark overlay effect
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // Ensures it's on top
      }}
      onClick={closeDetails} // Closes when clicking outside
    >
      <Paper
        sx={{
          p: 3,
          width: "90%",
          maxWidth: 500,
          boxShadow: 5,
          borderRadius: 3,
          bgcolor: "white",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        {/* Header with Icon and Close Button */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <UserCheck size={26} color="#1976d2" />
            <Typography variant="h5" color="primary" fontWeight="bold">
              Candidate Details
            </Typography>
          </Box>
          <IconButton onClick={closeDetails}>
            <X size={22} />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Form Fields */}
        <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Interviewer Email"
                name="interviewerEmail"
                value={formData.interviewerEmail}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                label="Schedule Date"
                name="scheduledDate"
                InputLabelProps={{ shrink: true }}
                value={formData.scheduledDate}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Candidate Name"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                required
                error={!!formErrors.candidateName}
                helperText={formErrors.candidateName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Candidate Email"
                name="candidateEmail"
                value={formData.candidateEmail}
                onChange={handleChange}
                required
                error={!!formErrors.candidateEmail}
                helperText={formErrors.candidateEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="LinkedIn Profile"
                name="candidateLinkedIn"
                value={formData.candidateLinkedIn}
                onChange={handleChange}
                required
                error={!!formErrors.candidateLinkedIn}
                helperText={formErrors.candidateLinkedIn}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Job Description"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                required
                error={!!formErrors.jobDescription}
                helperText={formErrors.jobDescription}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Resume (PDF link ending with .pdf)"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                required
                error={!!formErrors.resume}
                helperText={formErrors.resume}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} startIcon={<Send size={18} />}>
            Submit
          </Button>
          <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={closeDetails}>
            Close
          </Button>
        </Box>

        {/* Success Popup */}
        {showSuccess && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "white",
              p: 3,
              borderRadius: 3,
              boxShadow: 5,
              textAlign: "center",
              zIndex: 10000,
            }}
          >
            <CheckCircle size={40} color="#4caf50" />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Interview Scheduled Successfully!
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => setShowSuccess(false)}>
              OK
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default InterviewerDetails;
