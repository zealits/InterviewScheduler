import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { UserCheck, X, Filter, ChevronDown } from "lucide-react";
import InterviewerDetails from "./InterviewerCard"; // Component to display interviewer details
import SlotDetails from "./SlotDetails"; // Component to display slot details

const Calendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedDateInterviewers, setSelectedDateInterviewers] = useState([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState(null);
  const [showSlotDetails, setShowSlotDetails] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [filter, setFilter] = useState({ specialization: "", mode: "" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await axios.get("/api/interviewers/getallinterviewer", { params: filter });
        const interviewers = response.data;

        setSpecializations([...new Set(interviewers.map((int) => int.specialization))]);

        const availabilityMap = interviewers.reduce((map, interviewer) => {
          interviewer.availability.forEach(({ date, mode }) => {
            if (date) {
              if (!map[date]) {
                map[date] = { count: 0, interviewers: [] };
              }
              if (!filter.mode || mode === filter.mode) {
                map[date].count += 1;
                map[date].interviewers.push(interviewer);
              }
            }
          });
          return map;
        }, {});

        const eventData = Object.entries(availabilityMap).map(([date, { count, interviewers }]) => ({
          title: `${count} Available`,
          start: date,
          extendedProps: { interviewers },
        }));

        setEvents(eventData);
        setError(null);
      } catch (err) {
        console.error("Error fetching interviewers:", err);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchInterviewers();
  }, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseAll = () => {
    setSelectedInterviewer(null);
    setShowSlotDetails(false);
    setSelectedDateInterviewers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 sm:p-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold text-blue-800">Interviewer Calendar</h1>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden p-1 sm:p-2 bg-blue-500 rounded-full"
          >
            <Filter className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        {/* Filters */}
        <div
          className={`${
            isFilterOpen ? "block" : "hidden"
          } md:block bg-gray-100 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4`}
        >
          <div className="relative">
            <select
              name="specialization"
              className="w-full p-2 sm:p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all appearance-none"
              value={filter.specialization}
              onChange={handleFilterChange}
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              name="mode"
              className="w-full p-2 sm:p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all appearance-none"
              value={filter.mode}
              onChange={handleFilterChange}
            >
              <option value="">All Modes</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 pointer-events-none" />
          </div>
        </div>

        {/* Calendar */}
        <div className="p-3 sm:p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventContent={(eventInfo) => (
              <div className="relative bg-blue-200 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs flex items-center">
                <UserCheck className="w-3 h-3 mr-1" />
                {eventInfo.event.title}
              </div>
            )}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            className="border-2 border-blue-100 rounded-2xl"
            eventClick={(info) => {
              const interviewers = info.event.extendedProps.interviewers;
              setSelectedDateInterviewers(interviewers);
            }}
          />
        </div>

        {/* Interviewer Details */}
        {selectedDateInterviewers.length > 0 && (
          <div className="bg-gray-50 p-4 sm:p-6 relative">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
              Interviewers on Selected Date
            </h3>
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
              onClick={handleCloseAll}
            >
              ✖
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 cursor-pointer">
              {selectedDateInterviewers.map((interviewer, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-3 sm:p-4 hover:shadow-xl transition-all flex justify-between items-center"
                  onClick={() => setSelectedInterviewer(interviewer)}
                >
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-semibold text-gray-700">{interviewer.name}</span>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {interviewer.specialization}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slot Details */}
        {selectedInterviewer && !showSlotDetails && (
          <InterviewerDetails
            selectedInterviewer={selectedInterviewer}
            setShowSlotDetails={setShowSlotDetails}
            handleCloseAll={handleCloseAll}
          />
        )}
        {showSlotDetails && (
          <SlotDetails selectedInterviewer={selectedInterviewer} handleCloseAll={handleCloseAll} />
        )}
      </div>
    </div>
  );
};

export default Calendar;
