import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import {
  AlertCircle,
  Upload,
  X,
  UserCheck,
  Send,
  Clock,
  Calendar,
  Briefcase,
  FileText,
  Mail,
  User,
  Linkedin,
} from "lucide-react";

const InterviewerDetails = ({
  selectedCandidate,
  formData,
  handleChange,
  handleSubmit,
  closeDetails,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [resumeFile, setResumeFile] = useState(null);

  if (!selectedCandidate) return null;

  // Validate required fields
  const validateForm = () => {
    const errors = {};
    if (!formData.candidateName)
      errors.candidateName = "Candidate Name is required.";
    if (!formData.candidateEmail)
      errors.candidateEmail = "Candidate Email is required.";
    if (!formData.jobTitle) errors.jobTitle = "Job Title is required.";
    if (!formData.jobDescription)
      errors.jobDescription = "Job Description is required.";
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

  // Directly redirect without resetting showSuccess to prevent re-rendering the form
  const handleClosePopup = () => {
    window.location.href = "/admin"; // Redirect to admin dashboard
  };

  return (
    <>
      {/* Render the main form overlay only when the success popup is not shown */}
      {!showSuccess && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            p: 2,
          }}
        >
          <Paper
            sx={{
              width: "100%",
              maxWidth: 600,
              maxHeight: "90vh",
              overflowY: "auto",
              p: 2,
              boxShadow: 24,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <UserCheck size={24} color="#1976d2" />
                <Typography variant="h6" component="h2">
                  Meeting Details
                </Typography>
              </Box>
              <IconButton onClick={closeDetails}>
                <X size={20} />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Form */}
            <Box component="form" onSubmit={handleFormSubmit}>
              {/* Interviewer Information */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <UserCheck size={20} color="#1976d2" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Interviewer Information
                  </Typography>
                </Box>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <User size={16} color="#666" />
                        <Typography variant="body2" fontWeight="medium">
                          Name:
                        </Typography>
                        <Typography variant="body2">
                          {formData.interviewerName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Mail size={16} color="#666" />
                        <Typography variant="body2" fontWeight="medium">
                          Email:
                        </Typography>
                        <Typography variant="body2">
                          {formData.interviewerEmail}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Calendar size={16} color="#666" />
                        <Typography variant="body2" fontWeight="medium">
                          Date:
                        </Typography>
                        <Typography variant="body2">
                          {formData.scheduledDate}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Clock size={16} color="#666" />
                        <Typography variant="body2" fontWeight="medium">
                          Time:
                        </Typography>
                        <Typography variant="body2">
                          {formData.startTime} - {formData.endTime}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Candidate Details */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <UserCheck size={20} color="#1976d2" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Candidate Details
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleChange}
                      error={!!formErrors.candidateName}
                      helperText={formErrors.candidateName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="candidateEmail"
                      value={formData.candidateEmail}
                      onChange={handleChange}
                      error={!!formErrors.candidateEmail}
                      helperText={formErrors.candidateEmail}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="LinkedIn Profile"
                      name="candidateLinkedIn"
                      value={formData.candidateLinkedIn}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1 }}>
                            <Linkedin size={16} color="#666" />
                          </Box>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      error={!!formErrors.jobTitle}
                      helperText={formErrors.jobTitle}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1 }}>
                            <Briefcase size={16} color="#666" />
                          </Box>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Description"
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                      multiline
                      minRows={3}
                      error={!!formErrors.jobDescription}
                      helperText={formErrors.jobDescription}
                      InputProps={{
                        endAdornment: (
                          <Box sx={{ ml: 1 }}>
                            <FileText size={16} color="#666" />
                          </Box>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        document.getElementById("resume-upload").click()
                      }
                      startIcon={<Upload size={16} />}
                    >
                      Upload Resume
                    </Button>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      style={{ display: "none" }}
                      onChange={handleResumeChange}
                    />
                    {resumeFile && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        {resumeFile.name}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Send size={16} />}
                >
                  Submit
                </Button>
                <Button type="button" variant="outlined" onClick={closeDetails}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Success Popup with white background */}
      {showSuccess && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0.4,0.7)", // White background instead of dark overla
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1400,
            p: 2,
          }}
        >
          <Paper sx={{ width: "100%", maxWidth: 400, p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6">
                Request Sent Successfully!
              </Typography>
              <IconButton onClick={handleClosePopup}>
                <X size={20} />
              </IconButton>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Mail size={16} color="#666" />
                <Typography variant="body2" fontWeight="medium">
                  Interviewer:
                </Typography>
                <Typography variant="body2">
                  {formData.interviewerEmail}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Calendar size={16} color="#666" />
                <Typography variant="body2" fontWeight="medium">
                  Scheduled Date:
                </Typography>
                <Typography variant="body2">
                  {formData.scheduledDate}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Clock size={16} color="#666" />
                <Typography variant="body2" fontWeight="medium">
                  Scheduled Time:
                </Typography>
                <Typography variant="body2">
                  {formData.scheduledTime}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Briefcase size={16} color="#666" />
                <Typography variant="body2" fontWeight="medium">
                  Specialization:
                </Typography>
                <Typography variant="body2">
                  {formData.specialization || "N/A"}
                </Typography>
              </Box>
            </Box>
            <Button fullWidth variant="contained" onClick={handleClosePopup}>
              OK
            </Button>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default InterviewerDetails;
