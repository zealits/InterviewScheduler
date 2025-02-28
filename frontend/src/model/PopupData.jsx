import React from "react";
import { X } from "lucide-react";

const PopupData = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if the modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 ">
      {/* Success Popup */}
            
              <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-600 p-2 rounded-full">
                        <div className="flex items-center justify-center h-6 w-6 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Request Sent Successfully!
                      </h3>
                    </div>
                    <button
                      onClick={handleClosePopup}
                      className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
      
                  <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">
                          Interviewer:
                        </span>
                        <span className="text-gray-800">
                          {formData.interviewerName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="text-gray-800">
                          {formData.interviewerEmail}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Date:</span>
                        <span className="text-gray-800">
                          {formData.scheduledDate}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Time:</span>
                        <span className="text-gray-800">
                          {formData.startTime} - {formData.endTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">
                          Specialization:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {formData.specialization &&
                          formData.specialization.length > 0 ? (
                            formData.specialization.map((spec, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full shadow-sm"
                              >
                                {spec}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-800">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
      
                  <button
                    onClick={handleClosePopup}
                    className="w-full px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    OK
                  </button>
                </div>
              </div>
          
    </div>
  );
};

export default PopupData;
