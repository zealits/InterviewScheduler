import React, { useEffect, useState } from "react";
import axios from "axios";

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

  if (loading) return <p>Loading interviews...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {interviews.length > 0 ? (
        interviews.map((interview, index) => (
          <div
            key={index}
            style={{
              padding: "1rem",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            <p>
              <strong>Name:</strong> {interview.name}
            </p>
            <p>
              <strong>Email:</strong> {interview.email}
            </p>
            <p>
              <strong>Scheduled Date:</strong>{" "}
              {new Date(interview.scheduledDate).toLocaleString()}
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href={interview.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue" }}
              >
                Profile
              </a>
            </p>
            <p>
              <strong>Resume:</strong>{" "}
              <a
                href={interview.resume}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue" }}
              >
                Download
              </a>
            </p>
            {interview.details && (
              <p>
                <strong>Details:</strong> {interview.details}
              </p>
            )}
          </div>
        ))
      ) : (
        <p>No upcoming interviews.</p>
      )}
    </div>
  );
};

export default UpcomingInterviews;
