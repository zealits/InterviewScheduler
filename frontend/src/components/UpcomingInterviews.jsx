import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Mail, Linkedin, FileText, Info, Clock, User } from "lucide-react";

const UpcomingInterviews = ({ email }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) {
      setError("Email is required to fetch upcoming interviews.");
      setLoading(false);
      return;
    }

    const fetchInterviews = async () => {
      try {
        const response = await axios.get(
          `/api/interviewers/${email}/upcoming-interviews`
        );
        setInterviews(response.data.upcomingInterviews);
        console.log("upcoming interviews", response.data.upcomingInterviews);
      } catch (err) {
        setError("Failed to fetch interviews");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {interviews.length > 0 ? (
        interviews.map((interview, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-white" />
                <h3 className="text-lg font-semibold text-white">
                  {interview.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{interview.email}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">
                    {new Date(interview.scheduledDate).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Linkedin className="h-5 w-5 text-blue-500" />
                  <a
                    href={interview.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    LinkedIn Profile
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <a
                    href={interview.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    Download Resume
                  </a>
                </div>
              </div>

              {interview.details && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-gray-500 mt-1" />
                    <p className="text-gray-700">{interview.details}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No Upcoming Interviews
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You don't have any interviews scheduled at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingInterviews;