import React, { useEffect } from "react";

function Popup({ message, onClose }) {
  // Add escape key listener for better UX
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md animate-fadeIn z-50">
      <div
        className="bg-white rounded-2xl p-8 shadow-2xl transform scale-100 transition-all duration-300 ease-out w-fit max-w-md border border-indigo-100"
        style={{
          boxShadow:
            "0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
        }}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Success Icon with gradient background */}
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  className="animate-dash"
                />
              </svg>
            </div>
          </div>

          {/* Message Content with better typography */}
          <h3 className="text-xl font-bold text-gray-800 text-center leading-relaxed">
            {message}
          </h3>

          {/* Enhanced Button */}
          <button
            onClick={onClose}
            className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
