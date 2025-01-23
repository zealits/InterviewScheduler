import React, { useState } from "react";
import Popup from "../model/Popup";
import { useNavigate } from "react-router-dom";

function SlotDetail() {
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [showJobDescriptionForm, setShowJobDescriptionForm] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const toggleCandidateForm = () => setShowCandidateForm(!showCandidateForm);
  const toggleJobDescriptionForm = () =>
    setShowJobDescriptionForm(!showJobDescriptionForm);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSendInvite = () => {
    setPopupVisible(true);
    
    setTimeout(() => {
      setPopupVisible(false);
      navigate("/");
    }, 3000); // Auto-hide popup after 3 seconds
    
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 ">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md animate-fade-in">
          <h2 className="text-2xl font-bold text-zinc-800 mb-4">Slot Details</h2>
          <form>
            {/* Basic Details */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value="John Doe"
                readOnly
                className="w-full mt-1 p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Forms Toggles */}
            <button
              type="button"
              onClick={toggleJobDescriptionForm}
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-slate-500 hover:text-black transition duration-200 ease-in-out mb-4 w-full"
            >
              Job Description for Interviewer
            </button>
            {showJobDescriptionForm && (
              <textarea
                id="jobDescription"
                className="w-full mt-2 p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                rows="4"
                placeholder="Enter job description..."
              />
            )}

            <button
              type="button"
              onClick={toggleCandidateForm}
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-slate-500 hover:text-black transition duration-200 ease-in-out mb-4 w-full"
            >
              Enter Candidate Details for Inviting
            </button>
            {showCandidateForm && (
              <>
                <input
                  type="text"
                  id="candidateName"
                  placeholder="Candidate Name"
                  className="w-full mt-2 p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="email"
                  id="candidateEmail"
                  placeholder="Candidate Email"
                  className="w-full mt-2 p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="url"
                  id="linkedin"
                  placeholder="LinkedIn Profile"
                  className="w-full mt-2 p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </>
            )}

            {/* Send Invite */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleSendInvite}
                className="bg-black text-white py-2 px-4 rounded-md hover:bg-slate-500 hover:text-black transition duration-200 ease-in-out"
              >
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popup */}
      {isPopupVisible && (
  <Popup
    message="Invite Sent Successfully!"
    onClose={() => {
      setPopupVisible(false);
      navigate('/');
    }}
    className="z-60 fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-black rounded-md shadow-lg p-4 animate-popup"
  />
)}

    </>
  );
}

export default SlotDetail;
