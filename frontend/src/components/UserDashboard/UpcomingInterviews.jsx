import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import ical from "ical-generator";
import {
  User,
  Mail,
  Linkedin,
  FileText,
  Calendar,
  ArrowUp,
  ArrowDown,
  X,
  Download,
  Clock,
} from "lucide-react";
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
        setInterviews(data.upcomingInterviews);
      } catch (err) {
        setError("Failed to fetch interviews. Please try again later.");
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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Interviews</h2>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4 items-center">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by date"
          />
          <button
            onClick={() => setFilterDate("")}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-gray-700"
          >
            Clear
          </button>
        </div>

        <button
          onClick={handleSort}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          aria-label={`Sort by date (${sortOrder === "asc" ? "ascending" : "descending"})`}
        >
          {sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />} Sort by date
        </button>
      </div>

      {filteredInterviews.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewsToDisplay.map((interview, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transform hover:scale-105 transition-transform"
              >
                <div className="flex items-center mb-4 border-b pb-2">
                  <User className="text-blue-500 mr-3" size={24} />
                  <span className="font-semibold text-lg text-gray-700">
                    {interview.jobTitle}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="mr-2 text-blue-400" size={16} />
                    {interview.name?.charAt(0).toUpperCase() +
                      interview.name?.slice(1)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 text-blue-400" size={16} />
                    {new Date(interview.scheduledDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 text-blue-400" size={16} />
                    {interview.scheduledTime && ` ${interview.scheduledTime}`}
                  </div>
                  {interview.details && (
                    <p className="text-gray-500 italic text-sm">{interview.details}</p>
                  )}
                </div>
                <div className="flex justify-between mt-4 pt-2 border-t">
                  <a
                    href={interview.linkedin}
                    title="LinkedIn Profile" // Tooltip text
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin size={20} />
                  </a>
                  <button
                    title="Add to Calendar" // Tooltip text
                    onClick={() => handleAddToCalendar(interview)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Calendar size={20} />
                  </button>
                  <button
  title="View Resume PDF" // Tooltip text
  onClick={() => handlePdfClick(interview)}
  className="text-green-600 hover:text-green-800 transition"
  aria-label="View Resume"
>
  <FileText size={20} />
</button>
<button
  title="Download Resume PDF" // Tooltip text
  onClick={() => handleDownload(interview)}
  className="text-green-600 hover:text-green-800 transition"
  aria-label="Download Resume"
>
  <Download size={20} />
</button>

                </div>
              </div>
            ))}
          </div>

          {/* "View More" Button */}
          {visibleCount < filteredInterviews.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleViewMore}
                className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
              >
                View More + {filteredInterviews.length - visibleCount} remaining
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-600 bg-gray-100 p-6 rounded-md text-center">
          No upcoming interviews for the selected date.
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-4xl w-full">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              aria-label="Close PDF Viewer"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">
              {selectedPdf.filename || "PDF Viewer"}
            </h2>
            {selectedPdf.file?.objectUrl ? (
              <embed
                src={selectedPdf.file.objectUrl}
                type="application/pdf"
                width="100%"
                height="500px"
              />
            ) : (
              <div className="text-gray-600">PDF data unavailable</div>
            )}
          </div>
        </div>
      )}

      {/* Popup Modal for Error/Info Messages */}
      {popup.isOpen && (
        <PopupData
          isOpen={popup.isOpen}
          onClose={handleClosePopup}
          message={popup.message}
        />
      )}
    </div>
  );
};

export default UpcomingInterviews;
