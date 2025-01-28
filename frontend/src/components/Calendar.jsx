import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Filter } from "lucide-react";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filter, setFilter] = useState({ specialization: "", mode: "" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDateCount, setSelectedDateCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminAuthToken");
      try {
        const response = await axios.get("/api/user/availability", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data?.data || [];
        const availabilityEvents = data.flatMap((user) =>
          user.availabilityEvents.map((event) => ({
            ...event,
            title: user.name,
            specialization: user.specialization,
            backgroundColor: "lightgreen",
            borderColor: "green",
          }))
        );

        const customAvailability = data.flatMap((user) =>
          user.customAvailability.map((entry) => ({
            title: "Custom Availability",
            start: entry.start,
            end: entry.end,
            backgroundColor: "lightblue",
            borderColor: "blue",
            specialization: user.specialization,
          }))
        );

        const combinedEvents = [...availabilityEvents, ...customAvailability];
        setEvents(combinedEvents);
        setFilteredEvents(combinedEvents);

        const uniqueSpecializations = [
          ...new Set(data.map((user) => user.specialization)),
        ];
        setSpecializations(uniqueSpecializations);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch calendar data. Please try again.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter events based on the selected specialization
    if (filter.specialization) {
      const filtered = events.filter(
        (event) => event.specialization === filter.specialization
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [filter.specialization, events]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // const handleDateSelect = (selectionInfo) => {
  //   const { start, end } = selectionInfo;
  //   const newEvent = {
  //     title: "New Availability",
  //     start,
  //     end,
  //     backgroundColor: "lightcoral",
  //     borderColor: "red",
  //   };

  //   setEvents((prevEvents) => [...prevEvents, newEvent]);
  //   setFilteredEvents((prevFiltered) => [...prevFiltered, newEvent]);

  //   console.log("Selected range:", { start, end });
  // };

  const handleDateClick = (info) => {
    // Count events for the selected date
    const count = filteredEvents.filter(
      (event) =>
        new Date(event.start).toDateString() ===
        new Date(info.date).toDateString()
    ).length;
    setSelectedDateCount(count);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-4 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">Interviewer Calendar</h1>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
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
          </div>
        )}

        <div className="p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            // select={handleDateSelect}
            events={filteredEvents}
            dateClick={handleDateClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
          />

          <div className="mt-4 text-lg text-blue-800">
            Total interviewers on selected date: {selectedDateCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
