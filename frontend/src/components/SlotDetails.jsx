import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../model/Popup";

const SlotDetails = ({ selectedInterviewer, setShowSlotDetails }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (showPopup) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/admin");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showPopup, navigate]);

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    window.location.reload()
  };

  const handleCloseAll = () => {
    console.log("Closing SlotDetails and returning to InterviewerDetails...");
    setShowSlotDetails(false); // Trigger the parent component to switch views
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-lg bg-black/30 p-4">
      <div className="relative w-full sm:w-96 bg-white shadow-xl rounded-lg p-6">
        {/* Cross button to close everything */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          onClick={handleCloseAll} // Close SlotDetails and return to InterviewerDetails
        >
          ✖
        </button>

        <h3 className="text-xl font-semibold text-blue-800">Slot Details</h3>
        <p className="mt-2 font-semibold">Interviewer: {selectedInterviewer.name}</p>
        <p className="text-gray-600">Email: {selectedInterviewer.email}</p>
        <label className="block mt-4 font-semibold text-gray-800">Job Description:</label>
        <textarea className="w-full border p-2 rounded-lg" rows="3" />
        
        <h4 className="mt-4 text-lg font-semibold text-gray-800">Candidate Details</h4>
        <input type="text" placeholder="Candidate Name" className="w-full border p-2 rounded-lg mt-2" />
        <input type="email" placeholder="Candidate Email" className="w-full border p-2 rounded-lg mt-2" />
        <input type="text" placeholder="LinkedIn Profile" className="w-full border p-2 rounded-lg mt-2" />

        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleShowPopup}
        >
          Show Popup
        </button>

        {showPopup && (
          <Popup
            message={`Redirecting in ${countdown} seconds...`}
            onClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
};

export default SlotDetails;
