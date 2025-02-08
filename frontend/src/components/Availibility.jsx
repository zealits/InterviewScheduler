import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Availibility = () => {
    const [availabilityType, setAvailabilityType] = useState("range");
    const [availabilityRange, setAvailabilityRange] = useState({
        startDate: null,
        endDate: null,
        startTime: "",
        endTime: "",
        range: [],
    });
    const [customDates, setCustomDates] = useState([]);
    const [customAvailability, setCustomAvailability] = useState({
        startTime: "",
        endTime: "",
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
        if (customDates.length === 0) {
            alert("Please select at least one date.");
            return false;
        }
        if (!customAvailability.startTime || !customAvailability.endTime) {
            alert("Please provide start and end times for custom availability.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        try {
            let payload = {};
            if (availabilityType === "range" && validateRange()) {
                payload = {
                    availabilityRange: [
                        {
                            startDate: availabilityRange.startDate?.toISOString(),
                            endDate: availabilityRange.endDate?.toISOString(),
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
                        dates: [date.toISOString()],
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
                range: [],
            });
            setCustomDates([]);
            setCustomAvailability({
                startTime: "",
                endTime: "",
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
        <div className="p-8 space-y-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
                Interviewer Availability
            </h1>

            {/* Availability Type Selection */}
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
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date Range:</label>
                            <DatePicker
                                selectsRange
                                startDate={availabilityRange.range[0]}
                                endDate={availabilityRange.range[1]}
                                onChange={(range) => {
                                    setAvailabilityRange({
                                        ...availabilityRange,
                                        range,
                                        startDate: range[0] || null, // Synchronize startDate
                                        endDate: range[1] || null,   // Synchronize endDate
                                    });
                                }}
                                minDate={new Date()} // Disable past dates
                                className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholderText="Select date range"
                            />
                        </div>
                        <label className="block text-sm font-medium text-gray-700">Timezone:</label>
    <select
        value={customAvailability.timezone || "UTC+00:00"}
        onChange={(e) =>
            setCustomAvailability({ ...customAvailability, timezone: e.target.value })
        }
        className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
    >
        <option value="UTC+00:00">UTC+00:00 (Default)</option>
        <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
        <option value="UTC+05:30">UTC+05:30 (India Standard Time)</option>
        <option value="UTC+08:00">UTC+08:00 (China Standard Time)</option>
        {/* Add more as needed */}
    </select>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Time:</label>
                                <input
                                    type="time"
                                    value={availabilityRange.startTime}
                                    onChange={(e) => setAvailabilityRange({ ...availabilityRange, startTime: e.target.value })}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Time:</label>
                                <input
                                    type="time"
                                    value={availabilityRange.endTime}
                                    onChange={(e) => setAvailabilityRange({ ...availabilityRange, endTime: e.target.value })}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        {availabilityRange.startTime && availabilityRange.endTime && availabilityRange.startTime >= availabilityRange.endTime && (
                            <p className="text-red-500 text-sm">Start time must be earlier than end time.</p>
                        )}
                    </div>
                )}


                {/* Custom Dates */}
                {availabilityType === "custom" && (
    <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 block">
            Select Custom Dates:
        </label>
        <div className="border border-gray-300 rounded p-2">
            <DatePicker
                selected={null}
                onChange={(date) => {
                    if (customDates.some((d) => d.toDateString() === date.toDateString())) {
                        alert("This date is already selected.");
                        return;
                    }
                    handleAddCustomDate(date);
                }}
                minDate={new Date()} // Disable past dates
                className="w-full focus:ring-2 focus:ring-blue-500"
                inline
            />
        </div>
        {customDates.length > 0 ? (
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Dates:</h3>
                <ul className="space-y-2">
                    {customDates.map((date, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between bg-gray-100 p-2 rounded"
                        >
                            <span className="text-gray-700">
                                {date.toLocaleDateString()}
                            </span>
                            <button
                                onClick={() => handleRemoveCustomDate(index)}
                                className="text-red-500 text-sm hover:underline"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <p className="text-sm text-gray-500">No dates selected yet.</p>
        )}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Timezone:</label>
            <select
                className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                value={customAvailability.timezone || ""}
                onChange={(e) =>
                    setCustomAvailability({
                        ...customAvailability,
                        timezone: e.target.value,
                    })
                }
            >
                <option value="" disabled>
                    Choose a timezone
                </option>
                <option value="UTC-12:00">UTC-12:00</option>
                <option value="UTC-11:00">UTC-11:00</option>
                <option value="UTC-10:00">UTC-10:00</option>
                <option value="UTC-09:00">UTC-09:00</option>
                <option value="UTC-08:00">UTC-08:00</option>
                <option value="UTC-07:00">UTC-07:00</option>
                <option value="UTC-06:00">UTC-06:00</option>
                <option value="UTC-05:00">UTC-05:00</option>
                <option value="UTC-04:00">UTC-04:00</option>
                <option value="UTC-03:00">UTC-03:00</option>
                <option value="UTC-02:00">UTC-02:00</option>
                <option value="UTC-01:00">UTC-01:00</option>
                <option value="UTC+00:00">UTC+00:00</option>
                <option value="UTC+01:00">UTC+01:00</option>
                <option value="UTC+02:00">UTC+02:00</option>
                <option value="UTC+03:00">UTC+03:00</option>
                <option value="UTC+04:00">UTC+04:00</option>
                <option value="UTC+05:00">UTC+05:00</option>
                <option value="UTC+06:00">UTC+06:00</option>
                <option value="UTC+07:00">UTC+07:00</option>
                <option value="UTC+08:00">UTC+08:00</option>
                <option value="UTC+09:00">UTC+09:00</option>
                <option value="UTC+10:00">UTC+10:00</option>
                <option value="UTC+11:00">UTC+11:00</option>
                <option value="UTC+12:00">UTC+12:00</option>
            </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Start Time:
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
                    className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    End Time:
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
                    className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>
        {customAvailability.startTime &&
            customAvailability.endTime &&
            customAvailability.startTime >= customAvailability.endTime && (
                <p className="text-red-500 text-sm mt-2">
                    Start time must be earlier than end time.
                </p>
            )}
    </div>
)}

            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
            >
                Submit
            </button>
        </div>
    );
};

export default Availibility;
