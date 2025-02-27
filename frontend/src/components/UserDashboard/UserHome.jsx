import React, { useState, useEffect } from "react";
import { Calendar, User, ListChecks, Clock, Users, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import axios from "axios";

const UserHome = () => {
  const [upcomingInterviewCount, setUpcomingInterviewCount] = useState(0);
  const [stats, setStats] = useState({ pendingInterviews: 0 });
  const [availabilityRanges, setAvailabilityRanges] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    interviewerEmail: "",
    interviewerName: "",
    email: "",
    linkedin: "",
  });

  const userEmail = localStorage.getItem("userEmail");

  // Fetch user details and update formData
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("adminAuthToken");
      try {
        const response = await axios.get(`/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched User Details:", response.data);
        // Adjust the field names below as per your backend response
        setFormData({
          interviewerEmail: response.data.interviewerEmail || "",
          interviewerName: response.data.interviewerName || "",
          email: response.data.email || "",
          linkedin: response.data.linkedin || "",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    if (userEmail) {
      fetchUserDetails();
    }
  }, [userEmail]);

  // Fetch upcoming interviews (only those with confirmation true)
  useEffect(() => {
    const fetchUpcomingInterviews = async () => {
      const token = localStorage.getItem("adminAuthToken");
      try {
        const response = await axios.get(
          `/api/interviewers/${userEmail}/upcoming-interviews`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched Upcoming Interviews:", response.data);
        const data = Array.isArray(response.data?.upcomingInterviews)
          ? response.data.upcomingInterviews
          : [];
        const confirmedInterviews = data.filter(
          (interview) => interview.confirmation === true
        );
        setUpcomingInterviewCount(confirmedInterviews.length);
      } catch (error) {
        console.error("Error fetching upcoming interviews:", error);
        alert("Failed to fetch upcoming interviews.");
      }
    };
    if (userEmail) {
      fetchUpcomingInterviews();
    }
  }, [userEmail]);

  // Fetch pending approvals (only those with confirmation false)
  useEffect(() => {
    const fetchPendingInterviewCount = async () => {
      const token = localStorage.getItem("adminAuthToken");
      try {
        const response = await axios.get(
          `/api/interviewers/${userEmail}/pending-interviews`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched Pending Interviews:", response.data);
        const pendingData = Array.isArray(response.data?.pendingInterviews)
          ? response.data.pendingInterviews
          : Array.isArray(response.data?.upcomingInterviews)
          ? response.data.upcomingInterviews
          : [];
        const pendingApprovals = pendingData.filter(
          (interview) => interview.confirmation === false
        );
        setStats(prev => ({ ...prev, pendingInterviews: pendingApprovals.length }));
      } catch (error) {
        console.error("Error fetching pending interviews:", error);
        alert("Failed to fetch pending interviews.");
      }
    };
    if (userEmail) {
      fetchPendingInterviewCount();
    }
  }, [userEmail]);

  // Fetch availability data for slider
  useEffect(() => {
    const fetchAvailabilityData = async () => {
      const token = localStorage.getItem("adminAuthToken");
      try {
        const response = await axios.get(
          `/api/user/availability`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched Availability Data:", response.data);
        const availability = Array.isArray(response.data?.availabilityRange)
          ? response.data.availabilityRange
          : [];
        setAvailabilityRanges(availability);
      } catch (error) {
        console.error("Error fetching availability data:", error);
        alert("Failed to fetch availability data.");
      }
    };
    if (userEmail) {
      fetchAvailabilityData();
    }
  }, [userEmail]);

  // Slider navigation functions
  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < availabilityRanges.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center">
   

      <main className="w-full max-w-7xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upcoming Interviews Section */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-red-600 opacity-95"></div>
            <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_40%,rgba(255,255,255,0.1)_60%)]"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-400/30 backdrop-blur-md rounded-xl">
                    <Users className="text-red-50" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-red-50">Confirmed Availability</h2>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center h-48">
                <span className="text-7xl font-bold text-red-50">{upcomingInterviewCount}</span>
                <div className="flex items-center gap-2 mt-4">
                  <Clock className="text-red-100" size={20} />
                  <p className="text-red-50 text-xl font-medium">Scheduled Interviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Slider / Availability Section */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-95"></div>
            <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_40%,rgba(255,255,255,0.1)_60%)]"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-400/30 backdrop-blur-md rounded-xl">
                    <Calendar className="text-blue-50" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-blue-50">Availability</h2>
                </div>
                <span className="text-blue-100 font-medium">
                  {availabilityRanges.length} Slot{availabilityRanges.length !== 1 && "s"} Available
                </span>
              </div>
              {/* Slider */}
              <div className="bg-white rounded-xl p-4 shadow-lg flex items-center justify-center">
                {availabilityRanges.length > 0 ? (
                  <>
                    <button
                      onClick={handlePrev}
                      disabled={currentSlide === 0}
                      className="p-2"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-full max-w-md bg-blue-50 rounded-xl p-4 text-blue-900">
                      <div className="mb-2">
                        <span className="font-bold">Start Date: </span>
                        <span>
                          {new Date(
                            availabilityRanges[currentSlide].startDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="font-bold">End Date: </span>
                        <span>
                          {new Date(
                            availabilityRanges[currentSlide].endDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="font-bold">Start Time: </span>
                        <span>{availabilityRanges[currentSlide].startTime}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-bold">End Time: </span>
                        <span>{availabilityRanges[currentSlide].endTime}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={currentSlide === availabilityRanges.length - 1}
                      className="p-2"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </>
                ) : (
                  <p>No availability data found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Interview Details Section */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 opacity-95"></div>
            <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_40%,rgba(255,255,255,0.1)_60%)]"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-400/30 backdrop-blur-md rounded-xl">
                    <User className="text-purple-50" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-purple-50">Interview Information</h2>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-400/30 backdrop-blur-md rounded-xl p-4 hover:bg-purple-400/40 transition-colors">
                  <span className="text-purple-200 font-medium text-sm block mb-1">Full Name</span>
                  <span className="text-purple-50 font-medium">{formData.interviewerName}</span>
                </div>
                <div className="bg-purple-400/30 backdrop-blur-md rounded-xl p-4 hover:bg-purple-400/40 transition-colors">
                  <span className="text-purple-200 font-medium text-sm block mb-1">Email Address</span>
                  <span className="text-purple-50 font-medium">{formData.email}</span>
                </div>
                <div className="bg-purple-400/30 backdrop-blur-md rounded-xl p-4 hover:bg-purple-400/40 transition-colors">
                  <span className="text-purple-200 font-medium text-sm block mb-1">LinkedIn Interview</span>
                  <a
                    href={formData.linkedin ? `https://${formData.linkedin}` : "#"}
                    className="text-purple-50 font-medium hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formData.linkedin}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals Section */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 opacity-95"></div>
            <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_40%,rgba(255,255,255,0.1)_60%)]"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-400/30 backdrop-blur-md rounded-xl">
                    <ListChecks className="text-yellow-900" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-yellow-900">Pending Approvals</h2>
                </div>
                <button className="bg-yellow-400/30 hover:bg-yellow-400/40 transition-colors rounded-full px-3 py-1 text-yellow-900 font-medium text-sm flex items-center gap-2">
                  View All <ArrowRight size={14} />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center h-48">
                <span className="text-7xl font-bold text-yellow-900">{stats.pendingInterviews}</span>
                <div className="flex items-center gap-2 mt-4">
                  <CheckCircle className="text-yellow-900" size={20} />
                  <p className="text-yellow-900 text-xl font-medium">Awaiting Feedback</p>
                </div>
              </div>
              <div className="mt-4 bg-yellow-400/30 rounded-xl p-4 backdrop-blur-md">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-900 font-medium">Average Response Time</span>
                  <span className="text-yellow-900 font-bold">2.4 hrs</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <footer className="w-full text-center py-6 text-gray-600">
        <p>© 2025 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserHome;
