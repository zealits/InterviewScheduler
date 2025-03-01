import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { User, Mail, Calendar, Clock, Linkedin, X } from "lucide-react";
import Popup from "../../model/popup";

const DeclinedInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState({ isOpen: false, message: "" });
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterDate, setFilterDate] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  // Function to close the popup modal
  const handleClosePopup = () => {
    setPopup({ isOpen: false, message: "" });
  };

  // Retrieve the admin email from localStorage and encode it for the URL
  const adminEmail = localStorage.getItem("adminEmail");
  const encodedAdminEmail = adminEmail ? encodeURIComponent(adminEmail) : "";

  useEffect(() => {
    const fetchDeclinedInterviews = async () => {
      if (!encodedAdminEmail) {
        setError("Admin email is required to fetch declined interviews.");
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `/api/interviewers/${encodedAdminEmail}/decline-interview`
        );
        console.log("Raw response data:", data);
        // The backend returns an object with a key "declinedInterviews" which is an array of objects,
        // each having its own "declinedInterviews" array.
        const declinedList = data.declinedInterviews.reduce((acc, curr) => {
          if (Array.isArray(curr.declinedInterviews)) {
            return acc.concat(curr.declinedInterviews);
          }
          return acc;
        }, []);
        setInterviews(declinedList);
      } catch (err) {
        setError(
          "Failed to fetch declined interviews. Please try again later."
        );
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeclinedInterviews();
  }, [encodedAdminEmail]);

  // Reset visible count when filter or sort order changes
  useEffect(() => {
    setVisibleCount(6);
  }, [filterDate, sortOrder]);

  // Memoized filtered and sorted interviews
  const filteredInterviews = useMemo(() => {
    return interviews
      .filter((interview) =>
        filterDate
          ? new Date(interview.scheduledDate).toISOString().split("T")[0] ===
            filterDate
          : true
      )
      .sort((a, b) => {
        const dateA = new Date(a.scheduledDate);
        const dateB = new Date(b.scheduledDate);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [interviews, filterDate, sortOrder]);

  // Determine the subset of interviews to display based on visibleCount
  const interviewsToDisplay = filteredInterviews.slice(0, visibleCount);

  // Handler for the "View More" button
  const handleViewMore = () => {
    setVisibleCount((prevCount) =>
      Math.min(prevCount + 6, filteredInterviews.length)
    );
  };

  // Toggle sort order
  const handleSort = useCallback(() => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-48 text-gray-500">
        Loading declined interviews...
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mt-4"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded-md text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="sticky top-0 bg-gray-100 pt-2 pb-4 z-10 rounded-xl shadow-sm mb-8">
          <div className="bg-white rounded-xl shadow px-6 py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Declined Interviews
                </h2>
                <p className="text-gray-600 mt-1">
                  Interviews declined by interviewers (scheduled by admin)
                </p>
              </div>
              {/* Filters Section */}
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="w-full sm:w-44">
                  <label
                    htmlFor="dateFilter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    id="dateFilter"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200"
                  />
                </div>
                <div className="w-full sm:w-44">
                  <label
                    htmlFor="sortOrder"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sort by Date
                  </label>
                  <select
                    id="sortOrder"
                    value={sortOrder === "asc" ? "oldest" : "newest"}
                    onChange={handleSort}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-200"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
                <button
                  onClick={() => setFilterDate("")}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition duration-200 font-medium"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredInterviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewsToDisplay.map((interview, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-800 p-2 rounded-lg shadow-sm">
                          <User className="text-white" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {interview.jobTitle || "N/A"}
                        </h3>
                      </div>
                      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 shadow-sm">
                        Declined
                      </span>
                    </div>
                  </div>
                  {/* Card Content */}
                  <div className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-700">
                        <Mail className="mr-3 text-rose-500" size={18} />
                        <span className="text-sm font-medium">
                          {interview.name?.charAt(0).toUpperCase() +
                            interview.name?.slice(1) || "No Name"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <User className="mr-3 text-rose-500" size={18} />
                        <span className="text-sm font-medium">
                          {Array.isArray(interview.specialization)
                            ? interview.specialization.join(", ")
                            : interview.specialization || "No Specialization"}
                        </span>
                      </div>
                      {interview.scheduledDate && (
                        <div className="flex items-center text-gray-700">
                          <Calendar className="mr-3 text-amber-500" size={18} />
                          <span className="text-sm">
                            {new Date(
                              interview.scheduledDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                      {interview.interviewStartTime &&
                        interview.interviewEndTime && (
                          <div className="flex items-center text-gray-700">
                            <Clock className="mr-3 text-blue-500" size={18} />
                            <span className="text-sm">
                              {interview.interviewStartTime} -{" "}
                              {interview.interviewEndTime}
                            </span>
                          </div>
                        )}
                      <div className="flex justify-between pt-4 mt-2 border-t border-gray-100">
                        <a
                          href={interview.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition duration-200"
                          aria-label="LinkedIn Profile"
                          title="View LinkedIn Profile"
                        >
                          <Linkedin size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < filteredInterviews.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleViewMore}
                  className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium flex items-center gap-2"
                >
                  <span>
                    View More ({filteredInterviews.length - visibleCount}{" "}
                    remaining)
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm max-w-2xl mx-auto">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Calendar className="text-amber-500" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              No Declined Interviews
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no declined interviews for the selected date. New
              declined interviews will appear here when available.
            </p>
            <button
              onClick={() => setFilterDate("")}
              className="mt-6 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200 font-medium inline-flex items-center"
            >
              <Calendar className="mr-2" size={16} />
              View All Dates
            </button>
          </div>
        )}

        {/* Popup Modal */}
        {popup.isOpen && (
          <Popup
            isOpen={popup.isOpen}
            onClose={handleClosePopup}
            message={popup.message}
          />
        )}
      </div>
    </div>
  );
};

export default DeclinedInterviews;
