import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import ical from "ical-generator";
import { User, Mail, Calendar, Clock, Linkedin, FileText, Download, ArrowUp, ArrowDown, X } from 'lucide-react';

import PopupData from "../../model/PopupData";

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
      setInterviews(data.upcomingInterviews || []);  // Ensure it's always an array
    } catch (err) {
      setError("Failed to fetch interviews. Please try again later.");
      setInterviews([]);  // Set to empty array on error
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
    const calendar = ical({ name: `${interview.jobTitle} Interview` });
    // Use the "PUBLISH" method for better compatibility with Microsoft Calendar
    calendar.method("PUBLISH");
    const startTime = new Date(interview.scheduledDate);
    const endTime = new Date(interview.scheduledDate);
    endTime.setHours(endTime.getHours() + 1); // Assuming a 1-hour interview duration

    calendar.createEvent({
      start: startTime,
      end: endTime,
      summary: interview.jobTitle,
      description: `Interview with ${interview.name}. ${interview.details || ""}`.trim(),
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
            ? new Date(interview.scheduledDate).toISOString().split("T")[0] === filterDate
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Upcoming Interviews</h2>
        <p className="mt-2 text-gray-600">Manage and track your scheduled interviews</p>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-label="Filter by date"
              />
            </div>
            <button
              onClick={() => setFilterDate("")}
              className="w-full sm:w-auto px-4 py-2.5 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 transition-all duration-200 font-medium"
            >
              Clear Filter
            </button>
          </div>
          
          <button
            onClick={handleSort}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg transition-all duration-200"
            aria-label={`Sort by date (${sortOrder === "asc" ? "ascending" : "descending"})`}
          >
            {sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            Sort by Date
          </button>
        </div>
      </div>

      {filteredInterviews.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewsToDisplay.map((interview, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <User className="text-blue-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {interview.jobTitle}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Mail className="mr-3 text-blue-500" size={18} />
                      <span className="text-sm font-medium">
                        {interview.name?.charAt(0).toUpperCase() + interview.name?.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="mr-3 text-blue-500" size={18} />
                      <span className="text-sm">
                        {new Date(interview.scheduledDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="mr-3 text-blue-500" size={18} />
                      <span className="text-sm">
                        {interview.scheduledTime}
                      </span>
                    </div>
                    {interview.details && (
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg mt-3">
                        {interview.details}
                      </p>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
                    <a
                      href={interview.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin size={20} />
                    </a>
                    <button
                      onClick={() => handleAddToCalendar(interview)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      aria-label="Add to Calendar"
                    >
                      <Calendar size={20} />
                    </button>
                    <button
                      onClick={() => handlePdfClick(interview)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                      aria-label="View Resume"
                    >
                      <FileText size={20} />
                    </button>
                    <button
                      onClick={() => handleDownload(interview)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                      aria-label="Download Resume"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          {visibleCount < filteredInterviews.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleViewMore}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
              >
                View More ({filteredInterviews.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Calendar className="text-gray-400" size={28} />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Upcoming Interviews</h3>
          <p className="text-gray-500">There are no interviews scheduled for the selected date.</p>
        </div>
      )}

      {/* PDF Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedPdf.filename || "Resume Preview"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 p-1 hover:bg-gray-100 rounded-lg transition-all duration-200"
                aria-label="Close PDF Viewer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {selectedPdf.file?.objectUrl ? (
                <embed
                  src={selectedPdf.file.objectUrl}
                  type="application/pdf"
                  className="w-full h-[70vh] rounded-lg"
                />
              ) : (
                <div className="text-gray-600 text-center py-8">PDF data unavailable</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {popup.isOpen && (
        <PopupData
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
