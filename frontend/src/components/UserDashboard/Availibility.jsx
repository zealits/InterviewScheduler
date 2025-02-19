import React, { useState, Suspense } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, Trash2 } from "lucide-react";
const DatePicker = React.lazy(() => import("react-datepicker"));
// Lazy load the DatePicker component


const Availibility = () => {
  const [availabilityType, setAvailabilityType] = useState("range");
  const [availabilityRange, setAvailabilityRange] = useState({
    startDate: null,
    endDate: null,
    startTime: "",
    endTime: "",
    timezone: "UTC+00:00",
    range: [],
  });
  const [customDates, setCustomDates] = useState([]);
  const [customAvailability, setCustomAvailability] = useState({
    startTime: "",
    endTime: "",
    timezone: "UTC+00:00",
  });

  const handleAddCustomDate = (date) => {
    if (date) {
      setCustomDates((prevDates) => [...prevDates, date]);
    }
  };

  const handleRemoveCustomDate = (index) => {
    setCustomDates((prevDates) => prevDates.filter((_, i) => i !== index));
  };

  const validateRange = () => {
    const { range, startTime, endTime } = availabilityRange;

    if (!range || !range[0] || !range[1]) {
      alert("Please select a valid date range.");
      return false;
    }

    const [startDate, endDate] = range;

    if (startDate > endDate) {
      alert("Start date must be earlier than end date.");
      return false;
    }

    if (!startTime || !endTime) {
      alert("Please provide both start and end times.");
      return false;
    }

    if (startTime >= endTime) {
      alert("Start time must be earlier than end time.");
      return false;
    }

    return true;
  };

  const validateCustom = () => {
    const { startTime, endTime, timezone } = customAvailability;

    if (customDates.length === 0) {
      alert("Please select at least one date.");
      return false;
    }

    if (!startTime || !endTime) {
      alert("Please provide both start and end times.");
      return false;
    }

    if (startTime >= endTime) {
      alert("Start time must be earlier than end time.");
      return false;
    }

    if (!timezone) {
      alert("Please select a timezone.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      // Lazy load Axios when the submit button is clicked
      const { default: axios } = await import("axios");
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Detect user timezone

      let payload = {};
      if (availabilityType === "range" && validateRange()) {
        payload = {
          availabilityRange: [
            {
              startDate: moment.tz(availabilityRange.startDate, userTimeZone).utc().format(),
              endDate: moment.tz(availabilityRange.endDate, userTimeZone).utc().format(),
              startTime: availabilityRange.startTime,
              endTime: availabilityRange.endTime,
            },
          ],
          customAvailability: [],
        };
      } else if (availabilityType === "custom" && validateCustom()) {
        payload = {
          availabilityRange: [],
          customAvailability: customDates.map((date) => ({
            dates: [moment.tz(date, userTimeZone).utc().format()],
            startTime: customAvailability.startTime,
            endTime: customAvailability.endTime,
          })),
        };
      } else {
        return;
      }

      const token = localStorage.getItem("authToken");
      const response = await axios.put("/api/auth/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Availability updated successfully!");
      console.log(response.data);

      // Reset fields after successful submission
      setAvailabilityType("range");
      setAvailabilityRange({
        startDate: null,
        endDate: null,
        startTime: "",
        endTime: "",
        timezone: "UTC+00:00",
        range: [],
      });
      setCustomDates([]);
      setCustomAvailability({
        startTime: "",
        endTime: "",
        timezone: "UTC+00:00",
      });
    } catch (error) {
      console.error(
        "Error updating availability:",
        error.response?.data || error.message
      );
      alert("Failed to update availability. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
            <h1 className="text-3xl font-bold text-white text-center">
              Interviewer Availability
            </h1>
          </div>

          <div className="p-8 space-y-8">
            {/* Selection Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["range", "custom"].map((type) => (
                <label
                  key={type}
                  className={`relative flex items-center p-4 cursor-pointer rounded-lg transition-all duration-200 
                    ${availabilityType === type 
                      ? 'bg-gray-100 border-2 border-gray-800' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'}`}
                >
                  <input
                    type="radio"
                    name="availabilityType"
                    value={type}
                    checked={availabilityType === type}
                    onChange={() => setAvailabilityType(type)}
                    className="w-5 h-5 accent-gray-800"
                  />
                  <span className="ml-3 text-gray-800 font-medium capitalize">
                    {type} Selection
                  </span>
                </label>
              ))}
            </div>

            {/* Range Selection Form */}
            {availabilityType === "range" && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-10 rounded"></div>}>
                        <DatePicker
                          selectsRange
                          startDate={availabilityRange.range[0]}
                          endDate={availabilityRange.range[1]}
                          onChange={(range) => {
                            setAvailabilityRange({
                              ...availabilityRange,
                              range,
                              startDate: range[0] || null,
                              endDate: range[1] || null,
                            });
                          }}
                          minDate={new Date()}
                          className="w-full pl-10 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          placeholderText="Select date range"
                        />
                      </Suspense>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={availabilityRange.timezone}
                        onChange={(e) =>
                          setAvailabilityRange({
                            ...availabilityRange,
                            timezone: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-white"
                      >
                        <option value="UTC+00:00">UTC+00:00 (Default)</option>
                        <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
                        <option value="UTC+05:30">UTC+05:30 (IST)</option>
                        <option value="UTC+08:00">UTC+08:00 (CST)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="time"
                          value={availabilityRange.startTime}
                          onChange={(e) =>
                            setAvailabilityRange({
                              ...availabilityRange,
                              startTime: e.target.value,
                            })
                          }
                          className="w-full pl-10 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="time"
                          value={availabilityRange.endTime}
                          onChange={(e) =>
                            setAvailabilityRange({
                              ...availabilityRange,
                              endTime: e.target.value,
                            })
                          }
                          className="w-full pl-10 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {availabilityRange.startTime &&
                    availabilityRange.endTime &&
                    availabilityRange.startTime >= availabilityRange.endTime && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-red-600 text-sm font-medium">
                          Start time must be earlier than end time
                        </p>
                      </div>
                  )}
                </div>
              </div>
            )}

            {/* Custom Dates Selection */}
            {availabilityType === "custom" && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Custom Dates
                    </label>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded"></div>}>
                        <DatePicker
                          selected={null}
                          onChange={(date) => {
                            if (customDates.some((d) => d.toDateString() === date.toDateString())) {
                              alert("This date is already selected.");
                              return;
                            }
                            handleAddCustomDate(date);
                          }}
                          minDate={new Date()}
                          className="w-full"
                          inline
                        />
                      </Suspense>
                    </div>
                  </div>

                  {customDates.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Selected Dates
                      </h3>
                      <ul className="space-y-2">
                        {customDates.map((date, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                          >
                            <span className="text-gray-700 font-medium">
                              {date.toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => handleRemoveCustomDate(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-white"
                        value={customAvailability.timezone}
                        onChange={(e) =>
                          setCustomAvailability({
                            ...customAvailability,
                            timezone: e.target.value,
                          })
                        }
                      >
                        <option value="UTC+00:00">UTC+00:00</option>
                        <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
                        <option value="UTC+05:30">UTC+05:30 (IST)</option>
                        <option value="UTC+08:00">UTC+08:00 (CST)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="time"
                          value={customAvailability.startTime}
                          onChange={(e) =>
                            setCustomAvailability({
                              ...customAvailability,
                              startTime: e.target.value,
                            })
                          }
                          className="w-full pl-10 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="time"
                          value={customAvailability.endTime}
                          onChange={(e) =>
                            setCustomAvailability({
                              ...customAvailability,
                              endTime: e.target.value,
                            })
                          }
                          className="w-full pl-10 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {customAvailability.startTime &&
                    customAvailability.endTime &&
                    customAvailability.startTime >= customAvailability.endTime && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-red-600 text-sm font-medium">
                          Start time must be earlier than end time
                        </p>
                      </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-700 
                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 
                focus:ring-offset-2 font-medium text-lg"
            >
              Submit Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
  

export default Availibility;