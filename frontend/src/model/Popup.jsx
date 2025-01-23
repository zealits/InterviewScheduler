import React from "react";



function Popup({ message, onClose }) {
   
   
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl transform scale-105 transition-transform duration-300 ease-in-out">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-6 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-500"
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
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
        <p className="text-gray-600 text-center">
          Your invite has been sent. You can close this notification or it will disappear shortly.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Close
        </button>
        
      </div>
    </div>
  );
}

export default Popup;
