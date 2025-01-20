import axios from "axios";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchInterviewers } from "../utils/api";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDateInterviewers, setSelectedDateInterviewers] = useState([]);
 
  // useEffect(() => {
  //   fetchInterviewers()
  //   // const response= await axios.get(`/api/interviewers`);
    
  //     .then((interviewers) => {
  //       const availabilityMap = interviewers.reduce((map, interviewer) => {
  //         interviewer.availability.forEach(({ date }) => {
  //           if (date) {
  //             if (!map[date]) {
  //               map[date] = { count: 0, interviewers: [] };
  //             }
  //             map[date].count += 1;
  //             map[date].interviewers.push(interviewer.name);
  //           }
  //         });
  //         return map;
  //       }, {});

  //       const eventData = Object.entries(availabilityMap).map(
  //         ([date, { count }]) => ({
  //           title: `Total: ${count}`,
  //           start: date,
  //           extendedProps: { interviewers: availabilityMap[date].interviewers },
  //         })
  //       );
  //       setEvents(eventData);
  //     })
  //     .catch((err) => console.error("Error fetching interviewers:", err));
  // }, []);


  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await axios.get(`/api/interviewers/getallinterviewer`);
        console.log(response);
        const interviewers = response.data;

        const availabilityMap = interviewers.reduce((map, interviewer) => {
          interviewer.availability.forEach(({ date }) => {
            if (date) {
              if (!map[date]) {
                map[date] = { count: 0, interviewers: [] };
              }
              map[date].count += 1;
              map[date].interviewers.push(interviewer.name);
            }
          });
          return map;
        }, {});

        const eventData = Object.entries(availabilityMap).map(
          ([date, { count, interviewers }]) => ({
            title: `Total: ${count}`,
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
  }, []);
  const handleEventClick = (info) => {
    const interviewers = info.event.extendedProps.interviewers;
    setSelectedDateInterviewers(interviewers);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Interview Schedule
        </h2>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={(eventInfo) => (
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {eventInfo.event.title}
            </div>
          )}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          className="border rounded-lg"
          eventClick={handleEventClick}
        />

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
