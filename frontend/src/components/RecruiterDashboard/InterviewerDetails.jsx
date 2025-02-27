import React, { useState } from "react";
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
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-y-auto border border-gray-100">
            <div className="border-b border-gray-100 p-4 bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-600 p-2 rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Meeting Slot Details
                  </h2>
                </div>
                <button
                  onClick={closeDetails}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[80vh]  ">
              <form onSubmit={handleFormSubmit}>
                {/* Interviewer Information */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-green-600 p-1.5 rounded-full">
                      <UserCheck className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Interviewer Information
                    </h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="text-gray-800">
                          {formData.interviewerName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>
                        <span className="text-gray-800">
                          {formData.interviewerEmail}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Date:</span>
                        <span className="text-gray-800">
                          {formData.scheduledDate}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Time:</span>
                        <span className="text-gray-800">
                          {formData.startTime} - {formData.endTime} (
                          {formData.timeZone})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">
                          Specialization:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.isArray(formData.specialization) &&
                        formData.specialization.length > 0 ? (
                          formData.specialization.map((spec, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg"
                            >
                              {spec}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-800">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Candidate Details */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="bg-blue-600 p-1.5 rounded-full">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Candidate Details
                    </h3>
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
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            formErrors.candidateName
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-200 hover:border-blue-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all duration-200`}
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
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            formErrors.candidateEmail
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-200 hover:border-blue-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all duration-200`}
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
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all duration-200"
                        />
                        <Linkedin className="absolute left-3 top-2.5 h-5 w-5 text-blue-600" />
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
                          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                            formErrors.jobTitle
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-200 hover:border-blue-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all duration-200`}
                        />
                        <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-blue-600" />
                      </div>
                      {formErrors.jobTitle && (
                        <p className="text-sm text-red-500">
                          {formErrors.jobTitle}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Start Time Input */}
                      <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interview Start Time
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            placeholder="Start Time"
                            name="interviewStartTime"
                            value={formData.interviewStartTime}
                            onChange={handleChange}
                            min={formData.startTime}
                            max={formData.endTime}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                              formErrors.interviewStartTime
                                ? "border-red-500 ring-1 ring-red-500"
                                : "border-gray-200 hover:border-blue-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all duration-200`}
                          />
                          <Clock className="absolute left-3 top-2.5 h-5 w-5 text-blue-600" />
                        </div>
                        {formErrors.interviewStartTime && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.interviewStartTime}
                          </p>
                        )}
                      </div>

                      {/* End Time Input */}
                      <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interview End Time
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            placeholder="End Time"
                            name="interviewEndTime"
                            value={formData.interviewEndTime}
                            onChange={handleChange}
                            min={formData.interviewStartTime}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                              formErrors.interviewEndTime
                                ? "border-red-500 ring-1 ring-red-500"
                                : "border-gray-200 hover:border-blue-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all duration-200`}
                          />
                          <Clock className="absolute left-3 top-2.5 h-5 w-5 text-blue-600" />
                        </div>
                        {formErrors.interviewEndTime && (
                          <p className="text-sm text-red-500 mt-1">
                            {formErrors.interviewEndTime}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        placeholder="Job Description"
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          formErrors.jobDescription
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-gray-200 hover:border-blue-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm min-h-[120px] transition-all duration-200`}
                      />
                      {formErrors.jobDescription && (
                        <p className="text-sm text-red-500">
                          {formErrors.jobDescription}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                            formErrors.specialization
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-200 hover:border-blue-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all duration-200`}
                        />
                        <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-blue-600" />
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
                        className="flex items-center px-4 py-2.5 rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors text-blue-700 shadow-sm"
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
                        <p className="text-sm text-gray-600 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-600" />
                          {resumeFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex items-center justify-center px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={closeDetails}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 shadow-sm hover:shadow-md"
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
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-full">
                  <div className="flex items-center justify-center h-6 w-6 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Request Sent Successfully!
                </h3>
              </div>
              <button
                onClick={handleClosePopup}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-700">
                    Interviewer:
                  </span>
                  <span className="text-gray-800">
                    {formData.interviewerName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-800">
                    {formData.interviewerEmail}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="text-gray-800">
                    {formData.scheduledDate}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-700">Time:</span>
                  <span className="text-gray-800">
                    {formData.startTime} - {formData.endTime}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-700">
                    Specialization:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formData.specialization &&
                    formData.specialization.length > 0 ? (
                      formData.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full shadow-sm"
                        >
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-800">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleClosePopup}
              className="w-full px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
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
