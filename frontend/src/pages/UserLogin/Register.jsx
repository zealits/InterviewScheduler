import { registerUsers } from "../../utils/api";
import React, { useState } from "react";
// import { registerUsers } from "../../utils/api";
import Modal from "../../model/PopupForLogin";
import { useNavigate } from "react-router-dom";

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
      // alert("Registration successful!");
      console.log(response);
      setModalData({ title: "Success", message: "Registration successful!" });
      setModalOpen(true);
      localStorage.setItem("userAuthToken", response.token);
      navigate("/user/dashboard"); 


    } catch (error) {
      setModalData({ title: "Error", message: `${error}` });
      setModalOpen(true);
      console.error("Registration failed:", error);
      // alert("Error during registration.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center">Register</h2>
        <form onSubmit={handleRegister} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedinProfile"
              placeholder="Enter your LinkedIn profile URL"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Total Years of Experience</label>
            <input
              type="number"
              name="yearOfExperience"
              placeholder="Enter years of experience"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Experience as a Interviewer</label>
            <input
              type="number"
              name="experienceAsInterviewer"
              placeholder="Total experience as a Interviewer (in years)"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Candidates Interviewed</label>
            <input
              type="number"
              name="candidatesInterviewed"
              placeholder="Number of candidates interviewed"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Specialization</label>
            <select
              name="specialization"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select specialization</option>
              <option value="Cloud">Cloud</option>
              <option value="AI">AI</option>
              <option value="Language">Language</option>
              <option value="Domain">Domain</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      <Modal
        isOpen={modalOpen}
        title={modalData.title}
        message={modalData.message}
        onClose={() => setModalOpen(false)}
      />
      </div>
    </div>
  );
};

export default RegisterUser;


