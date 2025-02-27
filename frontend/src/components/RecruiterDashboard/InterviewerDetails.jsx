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
  CalendarHeartIcon,
} from "lucide-react";

const InterviewerDetails = ({
  selectedCandidate,
  formData,
  handleChange,
  handleSubmit,
  closeDetails,
  specialization = [], // dynamic list passed as prop
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(""); // error is now a string
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

  // Updated to handle single selection
  const handleSpecializationChange = (event) => {
    const { value, checked } = event.target;
    const updatedSpecialization = checked
      ? [...specialization, value] // Add if checked
      : specialization.filter((item) => item !== value);

    if (updatedSpecialization.length === 0) {
      setError("Please select at least one specialization.");
    } else {
      setError("");
    }

    handleChange(updatedSpecialization);
  };

  // Redirect to admin dashboard after success
  const handleClosePopup = () => {
    window.location.href = "/admin";
  };

  return (
    <>
      {!showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
          <div className="w-full max-w-2xl h-screen max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    Meeting Slot Details
                  </h2>
                </div>
                <button
                  onClick={closeDetails}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleFormSubmit}>
                {/* Interviewer Information */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-blue-50 p-1.5 rounded-full">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      Interviewer Information
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Name:</span>
                        <span>{formData.interviewerName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Email:</span>
                        <span>{formData.interviewerEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Date:</span>
                        <span>{formData.scheduledDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Time:</span>
                        <span>
                          {formData.startTime} - {formData.endTime}(
                          {formData.timeZone})
                        </span>
                      </div>
                      <div className="flex justify-end items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Specialization:</span>
                        <span>{formData.specialization || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Candidate Details */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="bg-blue-50 p-1.5 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Candidate Details</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Full Name"
                          name="candidateName"
                          value={formData.candidateName}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            formErrors.candidateName
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formErrors.candidateName && (
                          <p className="text-sm text-red-500">
                            {formErrors.candidateName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <input
                          type="email"
                          placeholder="Email Address"
                          name="candidateEmail"
                          value={formData.candidateEmail}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            formErrors.candidateEmail
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formErrors.candidateEmail && (
                          <p className="text-sm text-red-500">
                            {formErrors.candidateEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="LinkedIn Profile"
                          name="candidateLinkedIn"
                          value={formData.candidateLinkedIn}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Linkedin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Job Title"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                            formErrors.jobTitle
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {formErrors.jobTitle && (
                        <p className="text-sm text-red-500">
                          {formErrors.jobTitle}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="time"
                          placeholder="Slot Time"
                          name="interviewTime"
                          value={formData.interviewTime}
                          onChange={handleChange}
                          min="09:00"
                          max="18:00"
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                            formErrors.time
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {formErrors.interviewTime && (
                        <p className="text-sm text-red-500">
                          {formErrors.interviewTime}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <textarea
                        placeholder="Job Description"
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          formErrors.jobDescription
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]`}
                      />
                      {formErrors.jobDescription && (
                        <p className="text-sm text-red-500">
                          {formErrors.jobDescription}
                        </p>
                      )}
                    </div>

                    {/* Specialization as multiple checkboxes */}
                    {/* <div className="space-y-2">
                      <label className="font-medium">Specialization:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.specialization.map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              name="specialization"
                              value={option}
                              checked={formData.specialization}
                              onChange={handleSpecializationChange}
                              className="w-5 h-10"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                      {error && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {error}
                        </p>
                      )}
                      {formData.specialization.length > 0 && (
                        <p className="text-sm text-gray-700">
                          Selected: {formData.specialization.join(", ")}
                        </p>
                      )}
                    </div> */}

                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                            formErrors.specialization
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {formErrors.specialization && (
                        <p className="text-sm text-red-500">
                          {formErrors.specialization}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("resume-upload").click()
                        }
                        className="flex items-center px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Resume
                      </button>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleResumeChange}
                      />
                      {resumeFile && (
                        <p className="text-sm text-gray-600">
                          {resumeFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={closeDetails}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <div className="h-6 w-6 text-green-600">✓</div>
                </div>
                <h3 className="text-xl font-semibold">
                  Request Sent Successfully!
                </h3>
              </div>
              <button
                onClick={handleClosePopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Interviewer:</span>
                  <span>{formData.interviewerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{formData.interviewerEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Date:</span>
                  <span>{formData.scheduledDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Time:</span>
                  <span>{formData.scheduledTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Specialization:</span>
                  <span>{formData.specialization || "N/A"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleClosePopup}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewerDetails;
