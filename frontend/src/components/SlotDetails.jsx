import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const API_BASE_URL = "api/interviewers";
 // Replace with your actual backend URL

const SlotDetails = ({ selectedInterviewer, handleCloseAll }) => {
  const [candidateDetails, setCandidateDetails] = useState({
    name: "",
    email: "",
    linkedin: "",
    jobDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedInterviewer) {
    return null;
  }

  const { name, availability, specialization, email } = selectedInterviewer;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidateDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/addcandidate`, candidateDetails);
      console.log("Response:", response.data);
      alert("Candidate details submitted successfully!");
    } catch (error) {
      console.error("Error submitting candidate details:", error);
      alert("Failed to submit candidate details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-10/12 sm:w-2/3 lg:w-1/2 xl:w-1/3 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">
            Slots for {name} ({specialization})
            <h3 className="text-sm font-medium">{email}</h3>
          </h2>
          <button
            onClick={handleCloseAll}
            className="p-2 bg-white text-blue-500 rounded-full hover:bg-gray-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate Details Form */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Candidate Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={candidateDetails.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter candidate's name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={candidateDetails.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter candidate's email"
                required
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={candidateDetails.linkedin}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter LinkedIn profile URL"
                required
              />
            </div>
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={candidateDetails.jobDescription}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter job description"
                required
              />
            </div>
            <button
              type="submit"
              className={`px-4 py-2 w-full bg-blue-500 text-white rounded-lg shadow ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              } transition-all`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Slot Details */}
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Slots</h3>
          {availability && availability.length > 0 ? (
            availability.map((slot, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition-all"
              >
                <p className="text-sm sm:text-base font-medium text-gray-800">
                  <span className="font-semibold">Date:</span> {slot.date}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-semibold">Time:</span> {slot.time}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-semibold">Mode:</span> {slot.mode.charAt(0).toUpperCase() + slot.mode.slice(1)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No slots available for this interviewer.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotDetails;
