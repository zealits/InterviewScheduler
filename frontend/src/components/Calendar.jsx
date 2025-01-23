import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, Filter, UserCheck, ChevronDown } from "lucide-react";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDateInterviewers, setSelectedDateInterviewers] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filter, setFilter] = useState({ specialization: "", mode: "" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await axios.get("api/interviewers/getallinterviewer", { params: filter });
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
                map[date].interviewers.push({
                  name: interviewer.name,
                  specialization: interviewer.specialization,
                });
              }
            }
          });
          return map;
        }, {});

        const eventData = Object.entries(availabilityMap).map(([date, { count, interviewers }]) => ({
          title: `${count}`,
          start: date,
          extendedProps: { interviewers },
        }));

        setEvents(eventData);
      } catch (err) {
        console.error("Error fetching interviewers:", err);
      }
    };

    fetchInterviewers();
  }, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className=" bg-gray-100  sm:p-6 flex items-center justify-between">
          
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden p-1 sm:p-2 bg-blue-500 rounded-full"
          >
            <Filter className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className={`
          ${isFilterOpen ? 'block' : 'hidden'} 
          md:block bg-gray-100 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4
        `}>
          <div className="relative">
            <select
              name="specialization"
              className="w-full p-2 mb-2 sm:p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all appearance-none"
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

        {/* Selected Date Interviewers */}
        {selectedDateInterviewers.length > 0 && (
          <div className="bg-gray-50 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
              Interviewers on Selected Date
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {selectedDateInterviewers.map(({ name, specialization }, index) => (
                <div 
                  key={index} 
                  className="bg-white shadow-md rounded-lg p-3 sm:p-4 hover:shadow-xl transition-all flex justify-between items-center"
                >
                  <Link to='/detail' className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-semibold text-gray-700">{name}</span>
                  </Link>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {specialization}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;