import React from "react";

function Popup({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 shadow-xl transform scale-100 transition-transform duration-300 ease-out w-96 max-w-sm">
        <div className="flex flex-col items-center space-y-4">
          {/* Animated Success Icon */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Message Content */}
          <h3 className="text-xl font-semibold text-gray-800 text-center">
            {message}
          </h3>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-2 px-5 bg-gradient-to-b from-gray-800 to-gray-700 py-2 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
