import React, { useState, Suspense } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Popup from "../../model/popup";
import {
  Calendar,
  Clock,
  Check,
  CalendarCheck,
  X,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Navbar from "./Navbar";
// Lazy load the DatePicker component
const DatePicker = React.lazy(() => import("react-datepicker"));

const Availibility = () => {
  const [availabilityType, setAvailabilityType] = useState("range");
  const [popup, setPopup] = useState({ show: false, message: "" });
  // Using an object to store inline errors
  const [error, setError] = useState({});
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

  const handleClosePopup = () => {
    setPopup({ show: false, message: "" });
  };

  const handleRemoveCustomDate = (index) => {
    setCustomDates((prevDates) => prevDates.filter((_, i) => i !== index));
  };

  const validateRange = () => {
    const { range, startTime, endTime } = availabilityRange;
    let newErrors = {};

    if (!range || !range[0] || !range[1]) {
      newErrors.range = "Please select a valid date range.";
    } else {
      const [startDate, endDate] = range;
      if (startDate > endDate) {
        newErrors.range = "Start date must be earlier than end date.";
      }
    }

    if (!startTime || !endTime) {
      newErrors.time = "Please provide both start and end times.";
    } else if (startTime >= endTime) {
      newErrors.time = "Start time must be earlier than end time.";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCustom = () => {
    const { startTime, endTime, timezone } = customAvailability;
    let newErrors = {};

    if (customDates.length === 0) {
      newErrors.customDates = "Please select at least one date.";
    }

    if (!startTime || !endTime) {
      newErrors.customTime = "Please provide both start and end times.";
    } else if (startTime >= endTime) {
      newErrors.customTime = "Start time must be earlier than end time.";
    }

    if (!timezone) {
      newErrors.timezone = "Please select a timezone.";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Clear previous errors before submission
    setError({});
    try {
      // Lazy load Axios when the submit button is clicked
      const { default: axios } = await import("axios");

      let payload = {};
      if (availabilityType === "range" && validateRange()) {
        payload = {
          availabilityRange: [
            {
              startDate: availabilityRange.startDate?.toISOString(),
              endDate: availabilityRange.endDate?.toISOString(),
              startTime: availabilityRange.startTime,
              endTime: availabilityRange.endTime,
              timezone: availabilityRange.timezone,
            },
          ],
          customAvailability: [],
        };
      } else if (availabilityType === "custom" && validateCustom()) {
        payload = {
          availabilityRange: [],
          customAvailability: customDates.map((date) => ({
            dates: [date.toISOString()],
            startTime: customAvailability.startTime,
            endTime: customAvailability.endTime,
            timezone: customAvailability.timezone,
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
      setPopup({ show: true, message: "Availability updated successfully!" });

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

      setPopup({ show: true, message: "Failed to update availability." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-100 border border-gray-300 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gray-800 text-white py-5 px-8">
        <h1 className="text-2xl font-semibold">Interviewer Availability</h1>
        <p className="text-gray-300 mt-1">
          Set your available time slots for upcoming interviews
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Availability Type Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-gray-800 flex items-center">
            <Calendar className="mr-2" size={20} />
            Select Availability Type
          </h2>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                availabilityType === "range"
                  ? "border-gray-800 bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              onClick={() => setAvailabilityType("range")}
            >
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  name="availabilityType"
                  value="range"
                  checked={availabilityType === "range"}
                  onChange={() => setAvailabilityType("range")}
                  className="h-4 w-4 text-gray-800 focus:ring-gray-700"
                />
                <span className="ml-2 font-medium">Range Selection</span>
              </div>
              <p className="text-sm text-black ml-6">
                Select a continuous date range with same daily hours
              </p>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                availabilityType === "custom"
                  ? "border-gray-800 bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              onClick={() => setAvailabilityType("custom")}
            >
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  name="availabilityType"
                  value="custom"
                  checked={availabilityType === "custom"}
                  onChange={() => setAvailabilityType("custom")}
                  className="h-4 w-4 text-gray-800 focus:ring-gray-700"
                />
                <span className="ml-2 font-medium">Custom Dates</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">
                Select specific dates from the calendar
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          {/* Range Selection */}
          {availabilityType === "range" && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <Suspense
                  fallback={
                    <div className="h-10 w-full bg-gray-100 animate-pulse rounded"></div>
                  }
                >
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
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholderText="Select date range"
                  />
                </Suspense>
                {error?.range && (
                  <p className="text-red-600 text-sm mt-2">{error.range}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <div className="relative">
                    <select
                      value={availabilityRange.timezone}
                      onChange={(e) =>
                        setAvailabilityRange({
                          ...availabilityRange,
                          timezone: e.target.value,
                        })
                      }
                      className="appearance-none w-full bg-white border border-gray-300 p-3 rounded-md pr-10 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="UTC+00:00">
                        UTC+00:00 (Greenwich Mean Time)
                      </option>
                      <option value="UTC-05:00">
                        UTC-05:00 (Eastern Time)
                      </option>
                      <option value="UTC+05:30">
                        UTC+05:30 (India Standard Time)
                      </option>
                      <option value="UTC+08:00">
                        UTC+08:00 (China Standard Time)
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <Clock size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <div className="relative flex">
                    <input
                      type="time"
                      value={availabilityRange.startTime}
                      onChange={(e) =>
                        setAvailabilityRange({
                          ...availabilityRange,
                          startTime: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <div className="relative flex">
                    <input
                      type="time"
                      value={availabilityRange.endTime}
                      onChange={(e) =>
                        setAvailabilityRange({
                          ...availabilityRange,
                          endTime: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <div className="h-8"></div>
                  {availabilityRange.startTime &&
                    availabilityRange.endTime &&
                    availabilityRange.startTime >=
                      availabilityRange.endTime && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        Start time must be earlier than end time
                      </p>
                    )}
                  {error?.time && (
                    <p className="text-red-600 text-sm mt-2">{error.time}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Custom Dates */}
          {availabilityType === "custom" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 md:row-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-3">
                    Select Custom Dates
                  </label>
                  <Suspense
                    fallback={
                      <div className="h-64 w-full bg-gray-100 animate-pulse rounded"></div>
                    }
                  >
                    <DatePicker
                      selected={null}
                      onChange={(date) => {
                        if (
                          customDates.some(
                            (d) => d.toDateString() === date.toDateString()
                          )
                        ) {
                          setError({ customDates: "Date already selected" });
                          return;
                        }
                        handleAddCustomDate(date);
                      }}
                      minDate={new Date()}
                      className="w-full focus:ring-2 focus:ring-gray-500"
                      inline
                    />
                  </Suspense>
                  {error?.customDates && (
                    <p className="text-red-600 text-sm mt-2">
                      {error.customDates}
                    </p>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <CalendarCheck className="mr-2" size={16} />
                    Selected Dates
                  </h3>

                  {customDates.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto pr-2">
                      <ul className="space-y-2">
                        {customDates.map((date, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-100"
                          >
                            <span className="text-gray-800 font-medium">
                              {date.toLocaleDateString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <button
                              onClick={() => handleRemoveCustomDate(index)}
                              className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                              aria-label="Remove date"
                            >
                              <X size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500 bg-gray-50 rounded-md">
                      <Calendar className="mb-2 opacity-50" size={24} />
                      <p className="text-sm">No dates selected yet</p>
                      <p className="text-xs mt-1">
                        Click on dates in the calendar to add them
                      </p>
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <div className="relative">
                        <select
                          className="appearance-none w-full bg-white border border-gray-300 p-3 rounded-md pr-10 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          value={customAvailability.timezone}
                          onChange={(e) =>
                            setCustomAvailability({
                              ...customAvailability,
                              timezone: e.target.value,
                            })
                          }
                        >
                          <option value="UTC+00:00">
                            UTC+00:00 (Greenwich Mean Time)
                          </option>
                          <option value="UTC-05:00">
                            UTC-05:00 (Eastern Time)
                          </option>
                          <option value="UTC+05:30">
                            UTC+05:30 (India Standard Time)
                          </option>
                          <option value="UTC+08:00">
                            UTC+08:00 (China Standard Time)
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <Clock size={16} />
                        </div>
                      </div>
                      {error?.timezone && (
                        <p className="text-red-600 text-sm mt-2">
                          {error.timezone}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={customAvailability.startTime}
                          onChange={(e) =>
                            setCustomAvailability({
                              ...customAvailability,
                              startTime: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={customAvailability.endTime}
                          onChange={(e) =>
                            setCustomAvailability({
                              ...customAvailability,
                              endTime: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {customAvailability.startTime &&
                      customAvailability.endTime &&
                      customAvailability.startTime >=
                        customAvailability.endTime && (
                        <p className="text-red-600 text-sm flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          Start time must be earlier than end time
                        </p>
                      )}
                    {error?.customTime && (
                      <p className="text-red-600 text-sm mt-2">
                        {error.customTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className=" border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center font-medium"
          >
            <Check className="mr-2" size={18} />
            Submit Availability
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            You can edit your availability later if needed
          </p>
        </div>

        {popup?.show && (
          <Popup message={popup.message} onClose={handleClosePopup} />
        )}
      </div>
    </div>
  );
};

export default Availibility;
