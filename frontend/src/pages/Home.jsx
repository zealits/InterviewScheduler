import React from "react";
import { Link } from "react-router-dom";
import { User, UserPlus, LayoutDashboard, Settings, Calendar } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Calendar className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              Interview{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Scheduler
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Streamline Your Hiring Process with Precision and Ease
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Interviewer Login Card */}
            <Link
              to="/user/login"
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-90"></div>
              <div className="relative p-6 flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <User className="w-8 h-8 text-gray-900" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-gray-800">
                    Interviewer Login
                  </h3>
                  <p className="text-gray-800 opacity-90 group-hover:opacity-100">
                    Access your interview dashboard
                  </p>
                </div>
              </div>
            </Link>

            {/* Interviewer Register Card */}
            <Link
              to="/user/register"
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-90"></div>
              <div className="relative p-6 flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <UserPlus className="w-8 h-8 text-gray-900" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-gray-800">
                    Interviewer Register
                  </h3>
                  <p className="text-gray-800 opacity-90 group-hover:opacity-100">
                    Create your interviewer account
                  </p>
                </div>
              </div>
            </Link>

            {/* Admin Login Card */}
            <Link
              to="/login"
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-90"></div>
              <div className="relative p-6 flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <LayoutDashboard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white group-hover:text-white">
                    Recruiter Login
                  </h3>
                  <p className="text-white opacity-90 group-hover:opacity-100">
                    Manage system settings
                  </p>
                </div>
              </div>
            </Link>

            {/* Admin Register Card */}
            <Link
              to="/register"
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-90"></div>
              <div className="relative p-6 flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white group-hover:text-white">
                    Recruiter Register
                  </h3>
                  <p className="text-white opacity-90 group-hover:opacity-100">
                    Set up Recruiter access
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;