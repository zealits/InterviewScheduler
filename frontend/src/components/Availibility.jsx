import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, X, CheckCircle } from "lucide-react";

const Availability = () => {
  const userEmail = localStorage.getItem("userEmail");
  const [availabilityType, setAvailabilityType] = useState("range");

  const [availabilityRange, setAvailabilityRange] = useState({
    startDate: null,
    endDate: null,
    startTime: "",
    endTime: "",
  });
  const [customDates, setCustomDates] = useState([]);

  const handleAddCustomDate = (date) => {
    if (date && !customDates.some(d => d.toDateString() === date.toDateString())) {
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
                dates: [date.toISOString()],
              }))
            : [],
      };

      const token = localStorage.getItem("authToken");
      const response = await axios.put("/api/auth/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <h1 className="text-4xl font-bold text-white flex items-center">
            <Calendar className="mr-4" size={36} />
            Interviewer Availability
          </h1>
        </div>

        <div className="p-8 space-y-8">
          {/* Availability Type Selection */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Select Availability Type
            </h2>
            <div className="flex space-x-6">
              {["range", "custom"].map((type) => (
                <label 
                  key={type} 
                  className={`flex items-center space-x-3 cursor-pointer px-4 py-2 rounded-lg transition-all ${
                    availabilityType === type 
                    ? "bg-blue-100 text-blue-800" 
                    : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="availabilityType"
                    value={type}
                    checked={availabilityType === type}
                    onChange={() => setAvailabilityType(type)}
                    className="accent-blue-500"
                  />
                  <span className="text-lg font-medium capitalize">
                    {type} Selection
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Range Selection */}
          {availabilityType === "range" && (
            <div className="grid md:grid-cols-2 gap-6 ">
              {[
                { label: "Start Date", key: "startDate" },
                { label: "End Date", key: "endDate" },
                { label: "Start Time", key: "startTime", type: "time" },
                { label: "End Time", key: "endTime", type: "time" }
              ].map(({ label, key, type = "date" }) => (
                <div key={key} className="space-y-2 flex flex-col">
                  <label className="text-gray-700 font-medium">{label}:</label>
                  {type === "date" ? (
                    <DatePicker
                      selected={availabilityRange[key]}
                      onChange={(date) =>
                        setAvailabilityRange({
                          ...availabilityRange,
                          [key]: date,
                        })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type="time"
                      value={availabilityRange[key]}
                      onChange={(e) =>
                        setAvailabilityRange({
                          ...availabilityRange,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Custom Dates */}
          {availabilityType === "custom" && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <label className="text-gray-800 font-semibold text-lg mb-4 block">
                  Select Dates
                </label>
                <DatePicker
                  selected={null}
                  onChange={handleAddCustomDate}
                  inline
                  className="w-full"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Selected Dates
                </h3>
                {customDates.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {customDates.map((date, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm"
                      >
                        <span>{date.toLocaleDateString()}</span>
                        <button
                          onClick={() => handleRemoveCustomDate(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No dates selected yet.</p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg group"
          >
            <CheckCircle className="mr-2 group-hover:animate-pulse" size={24} />
            Submit Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default Availability;