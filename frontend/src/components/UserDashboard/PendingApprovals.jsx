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
        console.log(response.data.upcomingInterviews);
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

      // const adminResponse = await axios.get(`/api/admin/${email}/admin-email`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // const adminEmail = adminResponse.data.email;

      // await axios.post(`/api/send-email`, {
      //   interviewerEmail: email,
      //   adminEmail,
      //   candidateEmail,
      //   interviewId,
      // });

      
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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Approvals</h2>

      {/* Filtering and Sorting Controls */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div>
          <label
            htmlFor="dateFilter"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Date
          </label>
          <input
            type="date"
            id="dateFilter"
            value={filterDate}
            onChange={handleDateFilter}
            className="border border-gray-300 rounded-md p-2 mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="sortOrder"
            className="block text-sm font-medium text-gray-700"
          >
            Sort by Date
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mt-1"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {sortedInterviews.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewsToDisplay.map((interview) => (
              <div
                key={interview._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex items-center mb-4 border-b pb-2">
                  <User className="text-blue-500 mr-3" size={24} />
                  <span className="font-semibold text-lg text-gray-700">
                    {interview.jobTitle}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="mr-2 text-blue-400" size={16} />
                    {interview.name.charAt(0).toUpperCase() +
                      interview.name.slice(1)}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                   <Mail className="mr-2 text-blue-400" size={16} />
                    {interview.email}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 text-blue-400" size={16} />
                    Date: {new Date(interview.scheduledDate).toLocaleDateString()}{" "}
                    {
                      Intl.DateTimeFormat(undefined, {
                        timeZoneName: "short",
                      })
                        .formatToParts(new Date(interview.scheduledDate))
                        .find((part) => part.type === "timeZoneName").value
                    }
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 text-blue-400" size={16} />
                    Time: {interview.scheduledTime}
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleApproval(interview._id)}
                    className="flex items-center text-green-600 hover:text-green-800 transition"
                  >
                    <Check size={20} className="mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      setPopup({
                        isOpen: true,
                        message: "Feature to decline not implemented yet!",
                      })
                    }
                    className="flex items-center text-red-600 hover:text-red-800 transition"
                  >
                    <XCircle size={20} className="mr-1" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* "View More" Button with remaining count */}
          {visibleCount < sortedInterviews.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleViewMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                View More ({remainingCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-600 bg-gray-100 p-6 rounded-md text-center">
          No pending approvals.
        </div>
      )}

      {/* Popup Modal for Notifications */}
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

export default PendingApprovals;
