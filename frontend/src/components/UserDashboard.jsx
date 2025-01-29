import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "./Navbar";
import UpcomingInterviews from "./UpcomingInterviews";

const App = () => {
  const userEmail= localStorage.getItem("userEmail");
  const [availabilityType, setAvailabilityType] = useState("range");
  const [availabilityRange, setAvailabilityRange] = useState({
    startDate: null,
    endDate: null,
    startTime: "",
    endTime: "",
  });
  const [customDates, setCustomDates] = useState([]);
  const [upcomingInterview, setUpcomingInterview] = useState({
    email: "",
    scheduledDate: null,
    details: "",
  });





  const handleAddCustomDate = (date) => {
    if (date) {
      setCustomDates((prevDates) => [...prevDates, date]);
    }
  };

  const handleRemoveCustomDate = (index) => {
    setCustomDates((prevDates) => prevDates.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        availabilityRange:
          availabilityType === "range"
            ? [
                {
                  startDate: availabilityRange.startDate?.toISOString(),
                  endDate: availabilityRange.endDate?.toISOString(),
                  startTime: availabilityRange.startTime,
                  endTime: availabilityRange.endTime,
                },
              ]
            : [],
        customAvailability:
          availabilityType === "custom"
            ? customDates.map((date) => ({
                dates: [date.toISOString()], // Ensure it matches the backend structure
              }))
            : [],
        upcomingInterviews: upcomingInterview.email
          ? [
              {
                email: upcomingInterview.email,
                scheduledDate: upcomingInterview.scheduledDate?.toISOString(),
                details: upcomingInterview.details,
              },
            ]
          : [],
      };

      // Debugging: Log the payload to ensure it's correct
      console.log("Payload being sent to server:", payload);

      const token = localStorage.getItem("authToken");
      console.log(token);
      const response = await axios.put("/api/auth/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully!");
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      alert("Failed to update profile. Please try again.");
    }
  };

  return (

    <div className="p-8 space-y-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
    <Navbar />
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Interviewer Availability & Upcoming Interviews
      </h1>

      {/* Availability Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Availability</h2>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="availabilityType"
              value="range"
              checked={availabilityType === "range"}
              onChange={() => setAvailabilityType("range")}
              className="accent-blue-500"
            />
            <span className="text-gray-700">Range Selection</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="availabilityType"
              value="custom"
              checked={availabilityType === "custom"}
              onChange={() => setAvailabilityType("custom")}
              className="accent-blue-500"
            />
            <span className="text-gray-700">Custom Dates</span>
          </label>
        </div>

        {/* Range Selection */}
        {availabilityType === "range" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-gray-600">Start Date:</label>
              <DatePicker
                selected={availabilityRange.startDate}
                onChange={(date) =>
                  setAvailabilityRange({
                    ...availabilityRange,
                    startDate: date,
                  })
                }
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-gray-600">End Date:</label>
              <DatePicker
                selected={availabilityRange.endDate}
                onChange={(date) =>
                  setAvailabilityRange({ ...availabilityRange, endDate: date })
                }
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-gray-600">Start Time:</label>
              <input
                type="time"
                value={availabilityRange.startTime}
                onChange={(e) =>
                  setAvailabilityRange({
                    ...availabilityRange,
                    startTime: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-gray-600">End Time:</label>
              <input
                type="time"
                value={availabilityRange.endTime}
                onChange={(e) =>
                  setAvailabilityRange({
                    ...availabilityRange,
                    endTime: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Custom Dates */}
        {availabilityType === "custom" && (
          <div className="space-y-6">
            <label className="text-gray-600 text-lg font-medium">
              Select Dates:
            </label>
            <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
              <DatePicker
                selected={null}
                onChange={handleAddCustomDate}
                className="w-full focus:ring-2 focus:ring-blue-500"
                inline
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Selected Dates
              </h3>
              {customDates.length > 0 ? (
                <ul className="space-y-2">
                  {customDates.map((date, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg shadow-sm"
                    >
                      <span className="text-gray-700">
                        {date.toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleRemoveCustomDate(index)}
                        className="text-red-600 font-medium hover:underline hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No dates selected yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Interviews Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Upcoming Interviews</h2>

        <UpcomingInterviews email={userEmail} />
        <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Submit
      </button>
         </div>
    </div>
  );
};

export default App;
