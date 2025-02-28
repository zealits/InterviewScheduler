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
      navigate("/user/dashboard/home");
    } catch (error) {
      console.error("Login failed:", error);
      setModalData({ title: "Error", message: "Invalid email or password." });
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-10 px-8 relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full bg-white opacity-20"></div>
              <div className="absolute left-10 bottom-5 w-16 h-16 rounded-full bg-white opacity-10"></div>
            </div>
            <h2 className="text-3xl font-extrabold text-center text-white tracking-wide">
              Welcome Back
            </h2>
            <p className="text-center text-blue-100 mt-2 font-light">
              Sign in to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 pl-1">
                    Password
                  </label>
                  {/* Uncomment when forgot password is implemented
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition duration-150"
                  >
                    Forgot password?
                  </a> */}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full  bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:from-gray-900 hover:to-gray-800 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Sign In
            </button>

            {/* Separator and Create Account */}
            <div className="text-center space-y-4 mt-4">
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Don't have an account?
                  </span>
                  <button
                    onClick={() => navigate("/user/register")}
                    className="inline-block text-blue-600 hover:text-blue-800 font-medium transition duration-150"
                    type="button"
                  >
                    Create account
                  </button>
                </div>
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

export default LoginUser;
