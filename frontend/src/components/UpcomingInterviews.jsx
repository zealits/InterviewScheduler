import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Linkedin, FileText, Calendar } from "lucide-react";

const UpcomingInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
  const email = userEmail;

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
        console.log(response.data.upcomingInterviews);
      } catch (err) {
        setError("Failed to fetch interviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [email]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        Loading interviews...
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded-md text-center">
        {error}
      </div>
    );

  const confirmedInterviews = interviews.filter(
    (interview) => interview.confirmation === true
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upcoming Interviews
      </h2>
      {confirmedInterviews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {confirmedInterviews.map((interview, index) => (
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
                  {interview.name.charAt(0).toUpperCase() + interview.name.slice(1)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2 text-blue-400" size={16} />
                  {new Date(interview.scheduledDate).toLocaleString()}
                </div>
                {interview.details && (
                  <p className="text-gray-500 italic text-sm">
                    {interview.details}
                  </p>
                )}
              </div>
              <div className="flex justify-between mt-4 pt-2 border-t">
                <a
                  href={interview.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href={interview.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 transition"
                >
                  <FileText size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600 bg-gray-100 p-6 rounded-md text-center">
          No upcoming interviews.
        </div>
      )}
    </div>
  );
};

export default UpcomingInterviews;
