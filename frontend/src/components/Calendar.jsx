import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { UserCheck, Filter } from "lucide-react";

const Calendar = () => {
  const [events, setEvents] = useState([]); // All events
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered events
  const [specializations, setSpecializations] = useState([]); // Specialization options
  const [filter, setFilter] = useState({ specialization: "", mode: "" }); // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Filter modal toggle
  const [selectedDateInterviewers, setSelectedDateInterviewers] = useState([]); // Selected date's interviewers
  const [selectedDate, setSelectedDate] = useState(null); // Currently selected date
  const [eventCounts, setEventCounts] = useState({}); // Event counts per date

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminAuthToken");
      try {
        const response = await axios.get("/api/user/availability", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data?.data || [];
        const allEvents = data.flatMap((user) => {
          const customDates =
            user.customAvailability?.flatMap((entry) => entry.dates) || []; // Flatten custom dates

          const rangeDates = user.availabilityRange?.flatMap((range) => {
            const startDate = new Date(range.startDate);
            const endDate = new Date(range.endDate);
            const rangeDatesArray = [];

            // Generate all dates within the range
            for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
              rangeDatesArray.push(new Date(d).toISOString().slice(0, 10));
            }

            return rangeDatesArray;
          }) || [];

          return [...customDates, ...rangeDates].map((date) => ({
            title: `${user.name} (${user.specialization})`,
            start: date,
            specialization: user.specialization,
            extendedProps: { user },
          }));
        });

        setEvents(allEvents);
        setFilteredEvents(allEvents);

        // Count events per date
        const counts = allEvents.reduce((acc, event) => {
          const date = event.start;
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        setEventCounts(counts);

        const uniqueSpecializations = [...new Set(data.map((user) => user.specialization))];
        setSpecializations(uniqueSpecializations);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch calendar data. Please try again.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (filter.specialization) {
      filtered = filtered.filter(
        (event) => event.specialization === filter.specialization
      );
    }

    if (filter.mode) {
      filtered = filtered.filter((event) => event.mode === filter.mode);
    }

    setFilteredEvents(filtered);
  }, [filter, events]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateClick = (info) => {
    const date = new Date(info.date);
    setSelectedDate(date.toDateString());

    const interviewersOnDate = events
      .filter(
        (event) => new Date(event.start).toDateString() === date.toDateString()
      )
      .map((event) => ({
        name: event.title,
        specialization: event.specialization,
        user: event.extendedProps.user,
      }));

    setSelectedDateInterviewers(interviewersOnDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-6 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">Interviewer Calendar</h1>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>

        {isFilterOpen && (
          <div className="bg-gray-100 px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="specialization"
              value={filter.specialization}
              onChange={handleFilterChange}
              className="w-full border-2 border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
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
              value={filter.mode}
              onChange={handleFilterChange}
              className="w-full border-2 border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Modes</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        )}

        <div className="p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            events={filteredEvents.map((event) => ({
              ...event,
              title: `${event.extendedProps.user.name}`,
            }))}
            dateClick={handleDateClick}
            eventContent={(eventInfo) => (
              <div className="bg-blue-200 text-blue-800 px-2 py-1 rounded-lg flex items-center">
                <UserCheck className="w-4 h-4 mr-2" />
                {eventInfo.event.title}
              </div>
            )}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            dayCellContent={(cellInfo) => {
              const dateStr = cellInfo.date.toISOString().slice(0, 10);
              const count = eventCounts[dateStr] || 0;
              return (
                <div>
                  <div>{cellInfo.dayNumberText}</div>
                  {count > 0 && <div className="text-blue-600">{count} available</div>}
                </div>
              );
            }}
          />

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-blue-800">
              {selectedDate ? `Details for ${selectedDate}` : "Select a date to view details"}
            </h2>
            {selectedDateInterviewers.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {selectedDateInterviewers.map((user, index) => (
                  <li
                    key={index}
                    className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center"
                  >
                    <span className="text-blue-800 font-medium">{user.name}</span>
                    <button
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => alert(`Details for ${user.name}`)}
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mt-2">No interviewers available on this date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;