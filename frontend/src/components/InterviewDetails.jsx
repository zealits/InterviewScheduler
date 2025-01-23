import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Assuming you are using axios to fetch data

function InterviwerDetails() {
  const [formData, setFormData] = useState({
    experience: "",
    name: "",
    email: ""
  });

  // Fetching the data when the component mounts
  useEffect(() => {
    const fetchInterviewerDetails = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("/api/interviewers/details"); 
        // Assuming response.data contains the details like experience, name, and email
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching interviewer details:", error);
      }
    };

    fetchInterviewerDetails();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-black mb-4">Interviewer Details</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="experience" className="text-sm text-black">
              Experience:
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              className="w-full border border-black rounded-md p-2"
              disabled
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="text-sm text-black">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              className="w-full border border-black rounded-md p-2"
              disabled
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="text-sm text-black">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="w-full border border-black rounded-md p-2"
              disabled
            />
          </div>

          <Link to="/slot">
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-black/80 w-full"
            >
              Schedule Interview
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default InterviwerDetails;
