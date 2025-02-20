import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Calendar,
  Check,
  XCircle,
} from "lucide-react";
import PopupData from "../../model/PopupData";


const PendingApprovals = () => {
  const [pendingInterviews, setPendingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // Default sort order: newest first
  const [filterDate, setFilterDate] = useState(""); // For date filtering
  const [visibleCount, setVisibleCount] = useState(6); // For lazy loading
  // Popup state for showing messages instead of alerts
  const [popup, setPopup] = useState({ isOpen: false, message: "" });

  const userEmail = localStorage.getItem("userEmail");
  const email = userEmail;

  // Function to close the popup modal
  const handleClosePopup = () => {
    setPopup({ isOpen: false, message: "" });
  };

  // Fetch pending approvals (non-confirmed interviews) from API on component mount
  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        const response = await axios.get(
          `/api/interviewers/${email}/pending-interviews`
        );
        // Only include pending (non-confirmed) interviews
        setPendingInterviews(
          response.data.upcomingInterviews.filter(
            (interview) => !interview.confirmation
          )
        );
      } catch (err) {
        setError("Failed to fetch pending approvals.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, [email]);

  // Reset visible count when filter or sort order changes
  useEffect(() => {
    setVisibleCount(6);
  }, [filterDate, sortOrder]);

  // Handler to approve an interview
  const handleApproval = async (interviewId) => {
    try {
      await axios.post(`/api/interviewers/${email}/pending-interviews`, {
        email,
        interviewId,
      });
      setPendingInterviews((prev) =>
        prev.filter((interview) => interview._id !== interviewId)
      );
      setPopup({ isOpen: true, message: "Interview confirmed successfully!" });
    } catch (err) {
      console.error(err);
      setPopup({ isOpen: true, message: "Failed to confirm the interview." });
    }
  };

  // Update sort order based on user selection
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  // Update date filter
  const handleDateFilter = (event) => {
    setFilterDate(event.target.value);
  };

  // Filter and sort the pending interviews
  const sortedInterviews = [...pendingInterviews]
    .filter((interview) => {
      if (!filterDate) return true;
      const interviewDate = new Date(interview.scheduledDate)
        .toISOString()
        .split("T")[0];
      return interviewDate === filterDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.scheduledDate);
      const dateB = new Date(b.scheduledDate);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  // Determine the subset of interviews to display based on the visibleCount
  const interviewsToDisplay = sortedInterviews.slice(0, visibleCount);

  // Increase the visible count (lazy load more items)
  const handleViewMore = () => {
    setVisibleCount((prevCount) =>
      Math.min(prevCount + 6, sortedInterviews.length)
    );
  };

  // Calculate how many items remain to be loaded
  const remainingCount = sortedInterviews.length - visibleCount;

  if (loading)
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        Loading pending approvals...
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded-md text-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Pending Approvals</h2>
          <p className="mt-2 text-gray-600">Review and manage interview requests</p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="dateFilter" className="text-sm font-medium text-gray-700">
                Filter by Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dateFilter"
                  value={filterDate}
                  onChange={handleDateFilter}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="sortOrder" className="text-sm font-medium text-gray-700">
                Sort by Date
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {sortedInterviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewsToDisplay.map((interview) => (
                <div 
                  key={interview._id} 
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition duration-300"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="text-blue-600" size={24} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {interview.jobTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-700">
                        <Mail className="mr-3 text-blue-500" size={18} />
                        <span className="text-sm">
                          {interview.name.charAt(0).toUpperCase() + interview.name.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="mr-3 text-blue-500" size={18} />
                        <span className="text-sm">
                          {new Date(interview.scheduledDate).toLocaleDateString()}
                          {' '}
                          {Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
                            .formatToParts(new Date(interview.scheduledDate))
                            .find((part) => part.type === "timeZoneName").value}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="mr-3 text-blue-500" size={18} />
                        <span className="text-sm">{interview.scheduledTime}</span>
                      </div>
                      
                      <div className="flex justify-between pt-4 mt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleApproval(interview._id)}
                          className="inline-flex items-center px-4 py-2 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition duration-200"
                        >
                          <Check size={18} className="mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => setPopup({
                            isOpen: true,
                            message: "Feature to decline not implemented yet!"
                          })}
                          className="inline-flex items-center px-4 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition duration-200"
                        >
                          <XCircle size={18} className="mr-2" />
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < sortedInterviews.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleViewMore}
                  className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900  text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  View More ({remainingCount} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Calendar className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Pending Approvals</h3>
            <p className="text-gray-500">There are currently no interviews waiting for approval.</p>
          </div>
        )}

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

export default PendingApprovals;