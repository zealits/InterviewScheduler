import { registerUser } from "../utils/api";
import React, { useState } from "react";
import Modal from "../model/PopupForLogin"

const Register = () => {
  const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "" });
  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await registerUser(userData);
      // alert("Registration successful!");
      console.log(response);
      setModalData({ title: "Success", message: "Registration successful!" });
      setModalOpen(true);

    } catch (error) {
      console.error("Registration failed:", error);
      // alert("Error during registration.");
      setModalData({ title: "Error", message: `${error}` });
      setModalOpen(true);
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
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

export default Register;
