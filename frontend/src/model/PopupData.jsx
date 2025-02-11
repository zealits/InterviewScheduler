import React from "react";
import { X } from "lucide-react";

const PopupData = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if the modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 ">
      <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-2xl transform transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        {/* Popup Content */}
        <div className="text-center">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Notification
          </h3>
          <p className="text-gray-700">{message}</p>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full shadow hover:bg-blue-600 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupData;
