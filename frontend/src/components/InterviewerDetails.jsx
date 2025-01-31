import React from "react";

const InterviewerDetails = ({ selectedInterviewer, setShowSlotDetails, handleCloseAll }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-lg bg-black/30 p-4">
      <div className="w-full sm:w-96 bg-white shadow-xl rounded-lg p-6 relative">
        
        {/* Close Button (✖) */}
        <button 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
          onClick={handleCloseAll}
        >
          ✖
        </button>

        <h3 className="text-xl font-semibold text-blue-800">Selected Interviewer</h3>
        <p className="mt-2 font-semibold">{selectedInterviewer.name}</p>
        <p className="text-gray-600">{selectedInterviewer.email}</p>
        
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowSlotDetails(true)}
        >
          Next
        </button>
      </div>k
    </div>
  );
};

export default InterviewerDetails;
