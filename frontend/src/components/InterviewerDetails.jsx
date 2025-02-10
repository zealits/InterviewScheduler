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
import { X, UserCheck, Send, CheckCircle } from "lucide-react"; // Import icons
import { useState } from "react";

const InterviewerDetails = ({
  selectedCandidate,
  formData,
  handleChange,
  handleSubmit,
  closeDetails,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  // console.log(selectedCandidate);

  if (!selectedCandidate) return null;

  // Function to validate form fields
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

    handleSubmit(event);
    setShowSuccess(true);
  };

  const handleClosePopup = () => {
    setShowSuccess(false);
    window.location.href = "/admin"; // Redirect to calendar page
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6">
      <div className="w-full max-w-2xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {!showSuccess ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <UserCheck className="text-blue-600  w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Meeting Details
                  </h2>
                </div>
                <button
                  onClick={closeDetails}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content with Hidden Scrollbar */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              {/* Interviewer Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-xl border border-blue-200">
                <div className=" mb-4">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Interviewer Information
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/80 p-3 rounded-lg">
                    <span className="font-medium text-gray-600">Name</span>
                    <p className="mt-1 text-gray-900">
                      {formData.interviewerName}
                    </p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg">
                    <span className="font-medium text-gray-600">Email</span>
                    <p className="mt-1 text-gray-900">
                      {formData.interviewerEmail}
                    </p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg">
                    <span className="font-medium text-gray-600">Date</span>
                    <p className="mt-1 text-gray-900">
                      {formData.scheduledDate}
                    </p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg">
                    <span className="font-medium text-gray-600">Time</span>
                    <p className="mt-1 text-gray-900">
                      {formData.startTime} - {formData.endTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Candidate Form */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <UserCheck className="text-blue-600 h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Candidate Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors
                        focus:ring-2 focus:ring-blue-500 outline-none
                        ${
                          formErrors.candidateName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                    />
                    {formErrors.candidateName && (
                      <p className="text-red-500 text-xs">
                        {formErrors.candidateName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="candidateEmail"
                      value={formData.candidateEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors
                        focus:ring-2 focus:ring-blue-500 outline-none
                        ${
                          formErrors.candidateEmail
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                    />
                    {formErrors.candidateEmail && (
                      <p className="text-red-500 text-xs">
                        {formErrors.candidateEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      name="candidateLinkedIn"
                      value={formData.candidateLinkedIn}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors
                        focus:ring-2 focus:ring-blue-500 outline-none
                        ${
                          formErrors.candidateLinkedIn
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                    />
                    {formErrors.candidateLinkedIn && (
                      <p className="text-red-500 text-xs">
                        {formErrors.candidateLinkedIn}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors
                        focus:ring-2 focus:ring-blue-500 outline-none
                        ${
                          formErrors.jobTitle
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                    />
                    {formErrors.jobTitle && (
                      <p className="text-red-500 text-xs">
                        {formErrors.jobTitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors
                      focus:ring-2 focus:ring-blue-500 outline-none resize-none
                      ${
                        formErrors.jobDescription
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                  />
                  {formErrors.jobDescription && (
                    <p className="text-red-500 text-xs">
                      {formErrors.jobDescription}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Resume (PDF link)
                  </label>
                  <input
                    type="text"
                    name="resume"
                    value={formData.resume}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors
                      focus:ring-2 focus:ring-blue-500 outline-none
                      ${
                        formErrors.resume ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="https://example.com/resume.pdf"
                  />
                  {formErrors.resume && (
                    <p className="text-red-500 text-xs">{formErrors.resume}</p>
                  )}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex gap-4">
                <button
                  type="submit"
                  onClick={handleFormSubmit}
                  className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 
                    transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Send className="h-4 w-4" />
                  Submit Details
                </button>
                <button
                  type="button"
                  onClick={closeDetails}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg 
                    hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 max-w-md mx-auto text-center space-y-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Request Sent Successfully!
            </h3>
            <p className="text-gray-600">
              The meeting details have been submitted and the candidate will be
              notified.
            </p>
            <button
              onClick={handleClosePopup}
              className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 
                transition-colors font-medium mt-6"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewerDetails;
