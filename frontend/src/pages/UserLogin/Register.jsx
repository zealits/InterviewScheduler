import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUsers } from "../../utils/api";
import Modal from "../../model/PopupForLogin";

const RegisterUser = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [modalData, setModalData] = useState({ title: "", message: "" });

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      linkedinProfile: e.target.linkedinProfile.value,
      yearOfExperience: parseInt(e.target.yearOfExperience.value, 10),
      experienceAsInterviewer: e.target.experienceAsInterviewer.checked,
      specialization: e.target.specialization.value,
      candidatesInterviewed: parseInt(e.target.candidatesInterviewed.value, 10),
    };

    try {
      const response = await registerUsers(userData);
      setModalData({ title: "Success", message: "Registration successful!" });
      setModalOpen(true);
      localStorage.setItem("userAuthToken", response.token);
      navigate("/user/login");
    } catch (error) {
      setModalData({ title: "Error", message: `${error}` });
      setModalOpen(true);
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6">
            <h2 className="text-3xl font-bold text-center text-white">
              Create Your Account
            </h2>
            <p className="text-center text-blue-100 mt-2">
              Join our community of expert interviewers
            </p>
          </div>
          
          <form onSubmit={handleRegister} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedinProfile"
                  placeholder="https://linkedin.com/in/yourprofile"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                  type="number"
                  name="yearOfExperience"
                  placeholder="0"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Experience as Interviewer (Years)</label>
                <input
                  type="number"
                  name="experienceAsInterviewer"
                  placeholder="0"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Candidates Interviewed</label>
                <input
                  type="number"
                  name="candidatesInterviewed"
                  placeholder="0"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Specialization</label>
                <select
                  name="specialization"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Select your specialization</option>
                  <option value="Cloud">Cloud Computing</option>
                  <option value="AI">Artificial Intelligence</option>
                  <option value="Language">Programming Languages</option>
                  <option value="Domain">Domain Expertise</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition duration-200"
              >
                Create Account
              </button>
          
            <div className="text-center">
              {/* <a navigate="/user/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Already have an account? Login here
              </a> */}
              {/* use navigate instead of href */}
              <button onClick={() => navigate("/user/login")} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Already have an account? Login here
              </button>
            </div>
            </div>
          </form>

        </div>

      </div>
      
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