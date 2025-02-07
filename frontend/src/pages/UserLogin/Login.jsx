import React, { useState } from "react";
import { loginUser2 } from "../../utils/api";
import Modal from "../../model/PopupForLogin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginUser = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [modalData, setModalData] = useState({ title: "", message: "" });

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    localStorage.setItem("userEmail", userData.email);
    console.log(userData);
    
    try {
      const response = await loginUser2(userData);
      const { token } = response;
      login(token);
      setModalData({ title: "Success", message: "Login successful!" });
      setModalOpen(true);
      console.log(response);
      localStorage.setItem("authToken", response.token);
      navigate("/user/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setModalData({ title: "Error", message: "Invalid email or password." });
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-8 px-8">
            <h2 className="text-3xl font-bold text-center text-white">
              Welcome Back
            </h2>
            <p className="text-center text-blue-100 mt-2">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a 
                    href="/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition duration-200"
            >
              Sign In
            </button>

            <div className="text-center space-y-4">
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </div>
              
              <a 
                href="/register" 
                className="inline-block text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Create a free account
              </a>
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

export default LoginUser;