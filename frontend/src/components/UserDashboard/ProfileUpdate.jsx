import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, User, LinkedinIcon, BookOpen, Users, Brain, Briefcase, Check } from "lucide-react";
import Popup from "../../model/popup";

const UpdateProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [popup, setPopup] = useState({ show: false, message: "" });
  const [specialization, setSpecialization] = useState([]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [allSpecializations, setAllSpecializations] = useState([]);
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setPopup({ show: true, message: "User Not found!" });
        return;
      }

      try {
        const response = await axios.get(`/api/user?email=${email}`);
        const fetchedData = response.data;

        let fetchedSpecializations = fetchedData.specialization;

        if (Array.isArray(fetchedSpecializations) && fetchedSpecializations.length > 0) {
          const firstElement = fetchedSpecializations[0];
          if (typeof firstElement === "string" && firstElement.includes(",")) {
            fetchedSpecializations = [
              ...firstElement.split(",").map((spec) => spec.trim()),
              ...fetchedSpecializations.slice(1),
            ];
          }
        } else {
          fetchedSpecializations = [];
        }

        setUserData({ ...fetchedData, specialization: fetchedSpecializations });
        setSpecialization(fetchedSpecializations);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setPopup({ show: true, message: "Failed to fetch user details." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get("/api/specializations");
        setAllSpecializations(response.data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };

    fetchSpecializations();
  }, []);

  const handleAddSpecialization = () => {
    if (newSpecialization.trim() !== "" && !specialization.includes(newSpecialization.trim())) {
      setSpecialization([...specialization, newSpecialization.trim()]);
      setNewSpecialization("");
      setShowManualInput(false); // Hide manual input after adding
    }
  };

  const handleRemoveSpecialization = (index) => {
    setSpecialization(specialization.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setPopup({ show: true, message: "Updating profile..." });

    const updatedData = {
      ...userData,
      specialization,
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

  const handleSpecializationChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "other") {
      setShowManualInput(true); // Show manual input if "Other" is selected
      setNewSpecialization("");
    } else {
      setNewSpecialization(selectedValue);
      setShowManualInput(false); // Hide manual input if a valid option is selected
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
        <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-xl shadow-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-3">
            Update Profile
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-gray-500 to-gray-600 mx-auto rounded-full mb-3"></div>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gray-50 rounded-full -mr-20 -mt-20"></div>
                <div className="relative space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <User size={48} className="text-black" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={userData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-gray-500 focus:ring-0 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Email
                    </label>
                    <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-500 flex items-center space-x-2">
                      <span className="text-gray-600">✓</span>
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
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-gray-500 focus:ring-0 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-gray-50 rounded-full -mr-32 -mt-32"></div>
                <div className="relative">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Professional Experience
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center mb-2">
                          <LinkedinIcon size={20} className="text-green-600 mr-2" />
                          <label className="text-sm font-medium text-gray-700">
                            LinkedIn URL
                          </label>
                        </div>
                        <input
                          type="url"
                          value={userData.linkedinProfile || ""}
                          onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-gray-500 focus:ring-0 transition-all"
                        />
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <Users size={18} className="text-yellow-600 mr-2" />
                          <label className="text-sm font-medium text-gray-700">
                            Experience as Interviewer
                          </label>
                        </div>
                        <input
                          type="number"
                          value={userData.experienceAsInterviewer || ""}
                          onChange={(e) => handleInputChange("experienceAsInterviewer", e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-gray-500 focus:ring-0 transition-all"
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
                          onChange={(e) => handleInputChange("yearOfExperience", e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-gray-500 focus:ring-0 transition-all"
                        />
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <BookOpen size={18} className="text-orange-600 mr-2" />
                          <label className="text-sm font-medium text-gray-700">
                            Candidates Interviewed
                          </label>
                        </div>
                        <input
                          type="number"
                          value={userData.candidatesInterviewed || ""}
                          onChange={(e) => handleInputChange("candidatesInterviewed", e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-gray-500 focus:ring-0 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <Brain size={20} className="text-gray-600 mr-2" />
                      <label className="text-lg font-semibold text-gray-900">
                        Specialization
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {specialization.map((spec, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-200 text-gray-900 px-3 py-1 rounded-lg"
                        >
                          <span>{spec}</span>
                          <button
                            type="button"
                            value={userData.specialization || ""}
                            onClick={() => handleRemoveSpecialization(index)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <select
                        value={newSpecialization}
                        onChange={handleSpecializationChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="">Select a specialization</option>
                        {allSpecializations.map((spec, index) => (
                          <option key={index} value={spec}>
                            {spec}
                          </option>
                        ))}
                        <option value="other">Other (Add manually)</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddSpecialization}
                        className="bg-gray-700 text-white px-3 py-2 rounded-lg"
                      >
                        Add
                      </button>
                    </div>

                    {showManualInput && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={newSpecialization}
                          onChange={(e) => setNewSpecialization(e.target.value)}
                          placeholder="Enter specialization manually"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-4 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <span>Update Professional Profile</span>
                <Check size={20} className="opacity-0 group-hover:opacity-100 transition-all duration-200" />
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