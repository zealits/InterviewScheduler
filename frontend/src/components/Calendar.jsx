import axios from "axios";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDateInterviewers, setSelectedDateInterviewers] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filter, setFilter] = useState({ specialization: "", mode: "" });

  // Fetch interviewers and populate filters
  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await axios.get(
          "api/interviewers/getallinterviewer",
          { params: filter }
        );

        const interviewers = response.data;

        // Populate specialization options
        setSpecializations([
          ...new Set(interviewers.map((int) => int.specialization)),
        ]);

        const availabilityMap = interviewers.reduce((map, interviewer) => {
          interviewer.availability.forEach(({ date, mode }) => {
            if (date) {
              if (!map[date]) {
                map[date] = { count: 0, interviewers: [] };
              }
              if (!filter.mode || mode === filter.mode) {
                map[date].count += 1;
                map[date].interviewers.push(interviewer.name);
              }
            }
          });
          return map;
        }, {});

        const eventData = Object.entries(availabilityMap).map(
          ([date, { count, interviewers }]) => ({
            title: `${count}`,
            start: date,
            extendedProps: { interviewers },
          })
        );

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
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Interview Schedule
        </h2>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            name="specialization"
            className="p-2 border rounded"
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

          <select
            name="mode"
            className="p-2 border rounded"
            value={filter.mode}
            onChange={handleFilterChange}
          >
            <option value="">All Modes</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Calendar */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={(eventInfo) => (
            <div className="relative bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm max-w-max">
  {eventInfo.event.title}
  <div className="absolute left-4 bottom-[-6px] w-3 h-3 bg-blue-100 rotate-45"></div>
</div>

          )}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          className="border rounded-lg"
          eventClick={(info) => {
            const interviewers = info.event.extendedProps.interviewers;
            setSelectedDateInterviewers(interviewers);
          }}
        />

        {/* Selected Date Interviewers */}
        {selectedDateInterviewers.length > 0 && (
          <div className="mt-8 bg-gray-50 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Interviewers on Selected Date:
            </h3>
            <ul className="space-y-2">
              {selectedDateInterviewers.map((name, index) => (
                <li
                  key={index}
                  className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md shadow-sm"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
