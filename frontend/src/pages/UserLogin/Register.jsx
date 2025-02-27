import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUsers } from "../../utils/api";
import Modal from "../../model/PopupForLogin";
import { motion } from "framer-motion";

const RegisterUser = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [modalData, setModalData] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);

  // Specialization state
  const [specializations, setSpecializations] = useState([]);
  const [specializationInput, setSpecializationInput] = useState("");
  
  // Suggested specialization options
  const suggestedSpecializations = [
    "Cloud",
    "AI",
    "Data Science",
    "Cybersecurity",
    "DevOps",
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
  ];

  const handleAddSpecialization = () => {
    if (specializationInput && !specializations.includes(specializationInput)) {
      setSpecializations([...specializations, specializationInput]);
      setSpecializationInput("");
    }
  };

  const handleRemoveSpecialization = (index) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  const handleAddFromSuggestions = (specialization) => {
    if (!specializations.includes(specialization)) {
      setSpecializations([...specializations, specialization]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const userData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      linkedinProfile: e.target.linkedinProfile.value,
      yearOfExperience: parseInt(e.target.yearOfExperience.value, 10),
      experienceAsInterviewer: parseInt(
        e.target.experienceAsInterviewer.value,
        10
      ),
      specialization: specializations.join(","), // Convert array to string
      candidatesInterviewed: parseInt(e.target.candidatesInterviewed.value, 10),
    };

    try {
      const response = await registerUsers(userData);
      setModalData({ title: "Success", message: "Registration successful!" });
      setModalOpen(true);
      localStorage.setItem("userAuthToken", response.token);
      setTimeout(() => navigate("/user/login"), 1500);
    } catch (error) {
      setModalData({ title: "Error", message: `${error}` });
      setModalOpen(true);
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 py-8 px-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
              </svg>
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
            </div>
            <h2 className="text-3xl font-bold text-center text-white relative z-10">
              Create Your Expert Account
            </h2>
            <p className="text-center text-gray-300 mt-2 relative z-10">
              Join our community of professional interviewers and share your expertise
            </p>
          </div>

          <form onSubmit={handleRegister} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-gray-700 group-focus-within:text-gray-800 transition-colors">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-gray-700 group-focus-within:text-gray-800 transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-gray-700 group-focus-within:text-gray-800 transition-colors">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* LinkedIn Profile */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-gray-700 group-focus-within:text-gray-800 transition-colors">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 448 512" fill="currentColor">
                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    name="linkedinProfile"
                    placeholder="https://linkedin.com/in/yourprofile"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Years of Experience */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-gray-700 group-focus-within:text-gray-800 transition-colors">
                  Years of Experience
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    name="yearOfExperience"
                    placeholder="0"
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Experience as Interviewer */}
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-gray-700 group-focus-within:text-gray-800 transition-colors">
                  Experience as Interviewer (years)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    name="experienceAsInterviewer"
                    placeholder="0"
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Candidates Interviewed */}
              <div className="space-y-2 group col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-gray-700 group-focus-within:text-gray-800 transition-colors">
                  Candidates Interviewed
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    name="candidatesInterviewed"
                    placeholder="0"
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Specialization Section - Enhanced with Bubbles */}
              <div className="space-y-3 col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Areas of Specialization
                </label>

                {/* Selected Specializations as Bubbles */}
                <div className="flex flex-wrap gap-2 min-h-12">
                  {specializations.map((spec, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center bg-gray-700 text-white px-3 py-1.5 rounded-full shadow-sm"
                    >
                      <span className="mr-1 text-sm">{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialization(index)}
                        className="ml-1 text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Input Field for Custom Specialization */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={specializationInput}
                      onChange={(e) => setSpecializationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSpecialization();
                        }
                      }}
                      placeholder="Type a skill and press enter to add"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSpecialization}
                    className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add
                  </button>
                </div>

                {/* Suggested Specializations - Enhanced with Bubbles */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Suggested specializations:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSpecializations.map((suggested) => (
                      <button
                        key={suggested}
                        type="button"
                        onClick={() => handleAddFromSuggestions(suggested)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          specializations.includes(suggested)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm"
                        }`}
                        disabled={specializations.includes(suggested)}
                      >
                        {suggested}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors relative overflow-hidden group"
              >
                <span className={`flex justify-center items-center transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}>
                  Create Account
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                {loading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/user/login" className="font-medium text-gray-700 hover:text-gray-900">
                Sign in
              </a>
            </div>
          </form>
        </div>
      </motion.div>

      <Modal
        isOpen={modalOpen}
        title={modalData.title}
        message={modalData.message}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default RegisterUser;