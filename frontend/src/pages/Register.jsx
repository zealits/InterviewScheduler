import React, { useState } from "react";
import Modal from "../model/PopupForLogin";
import { registerUser } from "../utils/api";

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
      console.log(response);
      setModalData({ title: "Success", message: "Registration successful!" });
      setModalOpen(true);
    } catch (error) {
      console.error("Registration failed:", error);
      setModalData({ title: "Error", message: `${error}` });
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r bg-gray-900 py-6 px-8">
            <h2 className="text-3xl font-bold text-center text-white">
              Create Account
            </h2>
            <p className="text-center text-blue-100 mt-2">
              Join our platform today
            </p>
          </div>

          <form onSubmit={handleRegister} className="p-8 space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:from-gray-700 hover:to-gray-700 focus:ring-4 focus:ring-gray-300 transition duration-200"
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </a>
            </p>
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

export default Register;
