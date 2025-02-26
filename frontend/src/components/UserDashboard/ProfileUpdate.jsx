import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  User,
  LinkedinIcon,
  BookOpen,
  Users,
  Brain,
  Briefcase,
  Check,
  Loader2,
} from "lucide-react";
import Popup from "../../model/Popup";

const UpdateProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // If you need a separate custom specialization input, you can keep it;
  // otherwise, you can remove it.
  const [popup, setPopup] = useState({ show: false, message: "" });
  const [customSpecialization, setCustomSpecialization] = useState("");
  const [specialization, setSpecialization] = useState([""]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        alert("No email found in localStorage");
        return;
      }

      try {
        const response = await axios.get(`/api/user?email=${email}`);
        const fetchedData = response.data;

        // If fetched specialization is not one of the valid options,
        // you might want to treat it as a custom value.
        const validSpecializations = ["Cloud", "AI", "Language", "Domain"];
        if (!validSpecializations.includes(fetchedData.specialization)) {
          setCustomSpecialization(fetchedData.specialization);
          // You can choose to set the fetchedData to "Other" or just use the custom value.
          // For an array approach, we will use the custom value directly.
          fetchedData.specialization = fetchedData.specialization;
        }

        setUserData(fetchedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Once userData is fetched, update the specialization state.
  // This ensures that if the backend sends a specialization array, it’s loaded.
  useEffect(() => {
    if (userData) {
      const specArray = Array.isArray(userData.specialization)
        ? userData.specialization
        : [userData.specialization || ""];
      setSpecialization(specArray);
    }
  }, [userData]);

  const handleAddSpecialization = () => {
    setSpecialization([...specialization, ""]);
  };

  const handleRemoveSpecialization = (index) => {
    const updatedSpecialization = specialization.filter((_, i) => i !== index);
    setSpecialization(updatedSpecialization);
  };

  const handleChangeSpecialization = (index, value) => {
    const updatedSpecialization = [...specialization];
    updatedSpecialization[index] = value;
    setSpecialization(updatedSpecialization);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setPopup({ show: true, message: "Updating profile..."});

    // Create the payload with the specialization array directly.
    const updatedData = {
      ...userData,
      specialization, // This is an array e.g., ["Hacker", "AI", "Cloud"]
    };

    try {
      await axios.put("/api/profile", updatedData);
      setPopup({ show: true, message: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setPopup({ show: true, message: "Failed to update profile." });
    }
  };

  const handleInputChange = (field, value) => {
    setUserData((prevData) => ({ ...prevData, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
        <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-xl shadow-lg">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-700 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-50">
        <div className="bg-white px-6 py-4 rounded-xl shadow-lg text-red-500 font-medium flex items-center">
          <span>User data not available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Update Profile
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full mb-3"></div>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-20 -mt-20"></div>
                <div className="relative space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                      <User size={48} className="text-blue-500" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={userData.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-0 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Email
                    </label>
                    <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-500 flex items-center space-x-2">
                      <span className="text-blue-600">✓</span>
                      <span>{userData.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={userData.password || ""}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-0 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-blue-50 rounded-full -mr-32 -mt-32"></div>
                <div className="relative">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Professional Experience
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center mb-2">
                          <LinkedinIcon
                            size={20}
                            className="text-blue-600 mr-2"
                          />
                          <label className="text-sm font-medium text-gray-700">
                            LinkedIn URL
                          </label>
                        </div>
                        <input
                          type="url"
                          value={userData.linkedinProfile || ""}
                          onChange={(e) =>
                            handleInputChange("linkedinProfile", e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-0 transition-all"
                        />
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <Users size={18} className="text-blue-600 mr-2" />
                          <label className="text-sm font-medium text-gray-700">
                            Experience as Interviewer
                          </label>
                        </div>
                        <input
                          type="number"
                          value={userData.experienceAsInterviewer || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "experienceAsInterviewer",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-0 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center mb-2">
                          <Briefcase size={18} className="text-blue-600 mr-2" />
                          <label className="text-sm font-medium text-gray-700">
                            Years of Experience
                          </label>
                        </div>
                        <input
                          type="number"
                          value={userData.yearOfExperience || ""}
                          onChange={(e) =>
                            handleInputChange("yearOfExperience", e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-0 transition-all"
                        />
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <BookOpen size={18} className="text-blue-600 mr-2" />
                          <label className="text-sm font-medium text-gray-700">
                            Candidates Interviewed
                          </label>
                        </div>
                        <input
                          type="number"
                          value={userData.candidatesInterviewed || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "candidatesInterviewed",
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-0 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specialization Inputs */}
                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <Brain size={20} className="text-blue-600 mr-2" />
                      <label className="text-lg font-semibold text-gray-900">
                        Specialization
                      </label>
                    </div>
                    <div className="space-y-2">
                      {specialization.map((spec, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={spec}
                            onChange={(e) =>
                              handleChangeSpecialization(index, e.target.value)
                            }
                            placeholder="Enter specialization"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialization(index)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddSpecialization}
                        className="mt-2 bg-green-500 text-white px-3 py-2 rounded-lg"
                      >
                        Add Specialization
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <span>Update Professional Profile</span>
                <Check
                  size={20}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200"
                />
              </button>
            </div>
          </div>
        </form>
        {popup.show && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ show: false, message: "" })}
        />
      )}
      </div>
    </div>
  );
};

export default UpdateProfile;
