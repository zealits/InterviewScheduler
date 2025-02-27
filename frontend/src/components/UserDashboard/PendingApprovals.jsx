import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { User, Mail, Calendar, Check, XCircle, Clock } from "lucide-react";
import Popup from "../../model/popup";
import Navbar from "./Navbar";

const PendingApprovals = () => {
  const [pendingInterviews, setPendingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // Default sort order: newest first
  const [filterDate, setFilterDate] = useState(""); // For date filtering
  const [visibleCount, setVisibleCount] = useState(6); // For lazy loading
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

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to avoid time mismatches

        // Filter out interviews that are in the past
        const filteredInterviews = response.data.upcomingInterviews.filter(
          (interview) => {
            const interviewDate = new Date(interview.scheduledDate);
            interviewDate.setHours(0, 0, 0, 0);
            return interviewDate >= today && !interview.confirmation;
          }
        );

        // Only include pending (non-confirmed) interviews
        setPendingInterviews(filteredInterviews);
        console.log("Fetched Pending Approvals:", response.data);
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
    // Find the interview object in your pendingInterviews array
    const interview = pendingInterviews.find(
      (item) => item._id === interviewId
    );
    if (!interview) {
      console.error("Interview not found");
      return;
    }

    // Extract candidate email and other necessary fields from the interview object
    const {
      email: candidateEmail, // candidate's email
      name: candidateName,
      scheduledDate,
      jobTitle,
      jobDescription,
      scheduledTime, // e.g., "10:00 - 11:00"
      specialization,
      interviewStartTime,
      interviewEndTime,
      linkedin: candidateLinkedIn,
    } = interview;

    // Optionally, split scheduledTime into startTime and endTime if needed:
    const [startTime, endTime] = scheduledTime
      ? scheduledTime.split(" - ")
      : ["", ""];

    try {
      // Approve the interview (using the interviewId)
      await axios.post(`/api/interviewers/${email}/pending-interviews`, {
        email, // interviewer email from local storage
        interviewId,
      });
      setPendingInterviews((prev) =>
        prev.filter((interview) => interview._id !== interviewId)
      );

      // Continue with the rest of your flow (e.g., sending emails)
      const token = localStorage.getItem("adminAuthToken");
      if (!token) {
        console.error("No auth token found");
        setPopup({
          isOpen: true,
          message: "You are not authorized! Please log in.",
        });
        return;
      }

      const adminEmail = localStorage.getItem("adminEmail");

      // Fetch Admin Email
      const adminResponse = await axios.get(
        `/api/admin/${adminEmail}/admin-email`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedAdminEmail = adminResponse.data.email;
      if (!fetchedAdminEmail) {
        console.error("Admin email is not found.");
        return;
      }
      console.log("Fetched Admin Email:", fetchedAdminEmail);

      // Prepare FormData for upcoming interview submission
      const formDataWithFile = new FormData();
      const interviewObj = {
        email: candidateEmail ? candidateEmail.trim() : "",
        scheduledDate: scheduledDate ? scheduledDate.trim() : "",
        name: candidateName ? candidateName.trim() : "",
        jobTitle: jobTitle ? jobTitle.trim() : "",
        linkedin: candidateLinkedIn ? candidateLinkedIn.trim() : "",
        details: jobDescription ? jobDescription.trim() : "",
        scheduledTime: scheduledTime ? scheduledTime.trim() : "",
        specialization: Array.isArray(specialization)
          ? specialization
          : [specialization],
        interviewStartTime: interviewStartTime ? interviewStartTime.trim() : "",
        interviewEndTime: interviewEndTime ? interviewEndTime.trim() : "",
      };

      formDataWithFile.append(
        "upcomingInterviews",
        JSON.stringify([interviewObj])
      );

      const encodedEmail = encodeURIComponent(email.trim());

      // Submit interview data
      await axios.post(
        `/api/interviewers/${encodedEmail}/upcoming-interviews`,
        formDataWithFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Prepare email payloads
      const emailPayloadAdmin = {
        recipient: fetchedAdminEmail,
        subject: `New Interview Scheduled for ${candidateName}`,
        candidateName,
        interviewerEmail: email,
        jobTitle,
        scheduledDate,
        interviewStartTime,
        interviewEndTime,
        scheduledTime,
        specialization,
        startTime,
        endTime,
        jobDescription,
        candidateLinkedIn,
      };

      const emailPayloadInterviewer = {
        recipient: email,
        subject: `New Interview Scheduled for ${candidateName}`,
        candidateName,
        interviewerEmail: email,
        jobTitle,
        scheduledDate,
        interviewStartTime,
        interviewEndTime,
        scheduledTime,
        specialization,
        startTime,
        endTime,
        jobDescription,
        candidateLinkedIn,
      };

      const emailPayloadCandidate = {
        recipient: candidateEmail,
        subject: `New Interview Scheduled for ${candidateName}`,
        candidateName,
        interviewerEmail: email,
        jobTitle,
        scheduledDate,
        interviewStartTime,
        interviewEndTime,
        scheduledTime,
        specialization,
        startTime,
        endTime,
        jobDescription,
        candidateLinkedIn,
      };

      // Send emails to Admin, Interviewer, and Candidate
      await Promise.allSettled([
        axios.post(`/api/email/send-email`, emailPayloadAdmin),
        axios.post(`/api/email/send-email`, emailPayloadInterviewer),
        axios.post(`/api/email/send-email`, emailPayloadCandidate),
      ]);

      setPopup({ isOpen: true, message: "Interview confirmed successfully!" });
    } catch (err) {
      console.error(
        "Error submitting details:",
        err.response?.data || err.message
      );
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

  if (error)
    return (
      <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded-md text-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Static Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Fixed Position */}
        <div className="sticky top-0 bg-gray-100 pt-2 pb-6 z-10">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800">
                  Pending Approvals
                </h2>
                <p className="text-gray-600 mt-1">
                  Review and manage interview requests
                </p>
              </div>

              {/* Filters Section - Redesigned as horizontal in the header */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48">
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
                    onChange={handleDateFilter}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <label
                    htmlFor="sortOrder"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sort by Date
                  </label>
                  <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {sortedInterviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewsToDisplay.map((interview) => (
                <div
                  key={interview._id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-300"
                >
                  {/* Card Header with modern design */}
                  <div className="p-5 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-800 p-2 rounded-full">
                          <User className="text-white" size={20} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 uppercase">
                          {interview.jobTitle}
                        </h3>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Pending
                      </span>
                    </div>
                  </div>

                  {/* Card Content with cleaner layout */}
                  <div className="p-5">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Mail className="mr-3 text-blue-500" size={16} />
                        <span className="text-sm font-medium">
                          {interview.name.charAt(0).toUpperCase() +
                            interview.name.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="mr-3 text-green-500" size={16} />
                        <span className="text-sm">
                          {new Date(interview.scheduledDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="mr-3 text-purple-500" size={16} />
                        <span className="text-sm font-medium">
                          <span className="font-semibold">
                            {interview.interviewStartTime}
                          </span>{" "}
                          -{" "}
                          <span className="font-semibold">
                            {interview.interviewEndTime}
                          </span>
                        </span>
                      </div>

                      <div className="flex justify-between pt-4 mt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleApproval(interview._id)}
                          className="inline-flex items-center px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-600 transition duration-200"
                        >
                          <Check size={16} className="mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            setPopup({
                              message:
                                "Are you sure you want to decline this interview?",
                              isOpen: true,
                              onClose: () => setPopup(null),
                            })
                          }
                          className="inline-flex items-center px-3 py-2 rounded-md border border-red-500 text-yellow-600 hover:bg-red-50 transition duration-200"
                        >
                          <XCircle size={16} className="mr-2 text-yellow-500" />
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
                  className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-black transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  View More ({remainingCount} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Calendar className="text-indigo-500" size={28} />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Pending Approvals
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are currently no interviews waiting for approval. New
              requests will appear here when they are submitted.
            </p>
          </div>
        )}

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

export default PendingApprovals;
