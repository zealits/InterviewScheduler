import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import ical from "ical-generator";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Linkedin,
  FileText,
  Download,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";

import Popup from "../../model/popup";

const UpcomingInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Popup state for showing messages instead of alerts
  const [popup, setPopup] = useState({ isOpen: false, message: "" });
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterDate, setFilterDate] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  // State to control the number of displayed cards
  const [visibleCount, setVisibleCount] = useState(6);

  // Function to close the popup modal
  const handleClosePopup = () => {
    setPopup({ isOpen: false, message: "" });
  };

  const email = localStorage.getItem("userEmail");

  // Fetch interviews on component mount or when email changes
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!email) {
        setError("Email is required to fetch upcoming interviews.");
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `/api/interviewers/${email}/upcoming-interviews`
        );
        setInterviews(data.upcomingInterviews || []); // Ensure it's always an array
        setInterviews(data.upcomingInterviews || []); // Ensure it's always an array
      } catch (err) {
        setError("Failed to fetch interviews. Please try again later.");
        setInterviews([]); // Set to empty array on error
        setInterviews([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [email]);

  // Reset visible count when filters or sort order change
  useEffect(() => {
    setVisibleCount(6);
  }, [filterDate, sortOrder]);

  // Helper function to create an object URL from PDF data
  const createPdfObjectUrl = useCallback(
    (pdfData, contentType = "application/pdf") => {
      const blob = new Blob([new Uint8Array(pdfData)], { type: contentType });
      return URL.createObjectURL(blob);
    },
    []
  );

  // Toggle sort order
  const handleSort = useCallback(() => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  }, []);

  // Handle viewing the PDF in the modal with on-demand fetching
  const handlePdfClick = useCallback(
    async (interview) => {
      if (!interview.hasResume) {
        setPopup({ isOpen: true, message: "Resume data is not available." });
        return;
      }
      try {
        const response = await axios.get(
          `/api/interviewers/${email}/interviews/${interview._id}/resume`,
          { responseType: "arraybuffer" }
        );
        const objectUrl = createPdfObjectUrl(response.data, "application/pdf");
        setSelectedPdf({
          filename: interview.resumeFilename || "Resume.pdf",
          file: { objectUrl },
        });
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setPopup({ isOpen: true, message: "Failed to fetch resume PDF." });
      }
    },
    [createPdfObjectUrl, email]
  );

  // Handle closing the PDF modal and cleaning up the URL
  const handleCloseModal = useCallback(() => {
    if (selectedPdf?.file?.objectUrl) {
      URL.revokeObjectURL(selectedPdf.file.objectUrl);
    }
    setSelectedPdf(null);
  }, [selectedPdf]);

  // Handle downloading the PDF with on-demand fetching
  const handleDownload = useCallback(
    async (interview) => {
      if (!interview.hasResume) {
        setPopup({
          isOpen: true,
          message: "Resume data is not available for download.",
        });
        return;
      }
      try {
        const response = await axios.get(
          `/api/interviewers/${email}/interviews/${interview._id}/resume`,
          { responseType: "arraybuffer" }
        );
        const objectUrl = createPdfObjectUrl(response.data, "application/pdf");
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = interview.resumeFilename || "resume.pdf";
        a.click();
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        console.error("Failed to download PDF. Error:", error);
        setPopup({ isOpen: true, message: "Failed to download PDF." });
      }
    },
    [createPdfObjectUrl, email]
  );

  // Handle adding interview to calendar and downloading the .ics file

  const handleAddToCalendar = useCallback((interview) => {
    const calendar = ical({
      name: `${interview.jobTitle} Interview`,
      prodId: { company: "yourcompany.com", product: "InterviewScheduler" }, // Set PRODID for better compatibility
    });

    calendar.method("PUBLISH"); // Helps with Microsoft Outlook compatibility

    const startTime = new Date(interview.scheduledDate);
    const endTime = new Date(interview.scheduledDate);
    endTime.setHours(endTime.getHours() + 1); // 1-hour interview duration

    calendar.createEvent({
      id: interview.id || crypto.randomUUID(), // Ensure unique UID
      start: startTime,
      end: endTime,
      timestamp: new Date(),
      summary: `${interview.jobTitle} Interview`,

      location: interview.location || "Online",
      organizer: { name: "Recruiter", email: "recruiter@example.com" },
      attendees: [
        {
          name: interview.name,
          email: interview.email || "candidate@example.com",
        },

      ],
    });

    const icsContent = calendar.toString();
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${interview.jobTitle}-Interview.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Memoized filtered and sorted interviews
  const filteredInterviews = useMemo(() => {
    return interviews
      .filter(
        (interview) =>
          interview.confirmation === true &&
          (filterDate
            ? new Date(interview.scheduledDate).toISOString().split("T")[0] ===
            filterDate

            : true)
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

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-48 text-gray-500">
        Loading interviews...
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
                  Upcoming Interviews
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage and track your scheduled interviews
                </p>
              </div>

              {/* Filters Section - Improved layout */}
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
                    onChange={(e) => handleSort()}
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

        {filteredInterviews?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewsToDisplay.map((interview, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
                >
                  {/* Card Header with improved design */}
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-800 p-2 rounded-lg shadow-sm">
                          <User className="text-white" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {interview.jobTitle}
                        </h3>
                      </div>
                      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 shadow-sm">
                        Scheduled
                      </span>
                    </div>
                  </div>

                  {/* Card Content with improved layout */}
                  <div className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-700">
                        <Mail className="mr-3 text-rose-500" size={18} />
                        <span className="text-sm font-medium">
                          {interview.name?.charAt(0).toUpperCase() + interview.name?.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="mr-3 text-amber-500" size={18} />
                        <span className="text-sm">
                          {new Date(interview.scheduledDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="mr-3 text-blue-500" size={18} />
                        <span className="text-sm">
                          {interview.interviewStartTime} - {interview.interviewEndTime}
                        </span>
                      </div>


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
                        <button
                          onClick={() => handleAddToCalendar(interview)}
                          className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition duration-200"
                          aria-label="Add to Calendar"
                          title="Add Interview to Calendar"
                        >
                          <Calendar size={18} />
                        </button>
                        <button
                          onClick={() => handlePdfClick(interview)}
                          className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition duration-200"
                          aria-label="View Resume"
                          title="View Candidate Resume"
                        >
                          <FileText size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(interview)}
                          className="p-2 text-violet-600 hover:text-violet-800 hover:bg-violet-50 rounded-lg transition duration-200"
                          aria-label="Download Resume"
                          title="Download Resume as PDF"
                        >
                          <Download size={18} />
                        </button>
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
                  <span>View More ({filteredInterviews.length - visibleCount} remaining)</span>
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
              No Upcoming Interviews
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no interviews scheduled for the selected date. New
              interviews will appear here when they are scheduled.
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

        {/* PDF Modal - Improved design */}
        {selectedPdf && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedPdf.filename || "Resume Preview"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-900 p-1.5 hover:bg-gray-200 rounded-lg transition duration-200"
                    aria-label="Close PDF Viewer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {selectedPdf.file?.objectUrl ? (
                  <embed
                    src={selectedPdf.file.objectUrl}
                    type="application/pdf"
                    className="w-full h-[70vh] rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="text-gray-600 text-center py-12 bg-gray-50 rounded-lg">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="font-medium">PDF data unavailable</p>
                    <p className="text-sm text-gray-500 mt-2">The requested document could not be loaded</p>
                  </div>
                )}
              </div>
            </div>
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

export default UpcomingInterviews;
