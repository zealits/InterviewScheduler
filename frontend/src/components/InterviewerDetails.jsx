import { Box, Typography, Button, Paper, Grid, TextField, IconButton, Divider } from "@mui/material";
import { X, UserCheck, Send } from "lucide-react"; // Import icons
import { useState } from "react";

const InterviewerDetails = ({ selectedCandidate, formData, handleChange, handleSubmit, closeDetails }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [resumeFile, setResumeFile] = useState(null);

  if (!selectedCandidate) return null;

  // Function to validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.candidateName) errors.candidateName = "Candidate Name is required.";
    if (!formData.candidateEmail) errors.candidateEmail = "Candidate Email is required.";
    if (!formData.jobTitle) errors.jobTitle = "Job Title is required.";
    if (!formData.jobDescription) errors.jobDescription = "Job Description is required.";
    return errors;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Pass the resumeFile along with the event to handleSubmit
    handleSubmit(event, resumeFile);
    setShowSuccess(true);
  };

  const handleResumeChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleClosePopup = () => {
    setShowSuccess(false);
    window.location.href = "/admin"; // Redirect to calendar page
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "#f5f5f5",
        scrollBehavior: "unset",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={closeDetails}
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Icon and Close Button */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <UserCheck size={26} color="#1976d2" />
            <Typography variant="h5" color="primary" fontWeight="bold">
              Meeting Details
            </Typography>
          </Box>
          <IconButton onClick={closeDetails}>
            <X size={22} />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Form Fields */}
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          noValidate
          sx={{
            width: "100%",
            maxWidth: 700,
            p: 3,
            boxShadow: 4,
            borderRadius: 3,
            bgcolor: "white",
          }}
        >
          {/* Title Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Meeting Details
            </Typography>
            <Divider sx={{ flexGrow: 1, opacity: 0 }} />
            <IconButton onClick={closeDetails}>
              <X size={20} />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Details of the Interviewer you are assigned to:
          </Typography>

          <Grid container spacing={1.5}>
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

            {/* Candidate Details Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, ml: 2 }}>
              <UserCheck size={22} color="#1976d2" />
              <Typography variant="h6" color="primary" fontWeight="bold">
                Candidate Details
              </Typography>
            </Box>

            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Name"
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
                label="Email"
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
                error={!!formErrors.candidateLinkedIn}
                helperText={formErrors.candidateLinkedIn}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                error={!!formErrors.jobTitle}
                helperText={formErrors.jobTitle}
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
              <Button variant="contained" component="label">
                Upload Resume
                <input
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={handleResumeChange}
                />
              </Button>
              {resumeFile && <p>{resumeFile.name}</p>}
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} startIcon={<Send size={16} />}>
            Submit
          </Button>
          <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={closeDetails}>
            Close
          </Button>
        </Box>

        {showSuccess && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "rgba(255, 255, 255, 1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10000,
            }}
          >
            <Box
              sx={{
                bgcolor: "#ffffff",
                p: 3,
                borderRadius: 3,
                boxShadow: 5,
                textAlign: "center",
                width: "90%",
                maxWidth: 400,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Interview Scheduled Successfully!
                </Typography>
                <IconButton onClick={handleClosePopup}>
                  <X size={22} />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="body1"><strong>Interviewer:</strong> {formData.interviewerEmail}</Typography>
              <Typography variant="body1"><strong>Scheduled Time:</strong> {formData.scheduledDate}</Typography>
              <Typography variant="body1"><strong>Specialization:</strong> {formData.specialization || "N/A"}</Typography>

              <Button variant="contained" sx={{ mt: 2 }} onClick={handleClosePopup}>
                OK
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default InterviewerDetails;
