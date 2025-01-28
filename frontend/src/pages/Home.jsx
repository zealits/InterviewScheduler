import React from "react";
import { Link } from "react-router-dom";
import { User, UserPlus, LayoutDashboard, Settings } from "lucide-react";

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-2xl shadow-2xl border border-gray-300 bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="text-center pb-6">
          <h1 className="text-4xl font-extrabold text-black drop-shadow-lg">
            Interview <span className="text-black">Scheduler</span>
          </h1>
          <p className="text-sm text-black mt-2">
            Streamline Your Hiring Process with Precision and Ease
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/user/login"
            className="flex items-center justify-start w-full p-4 bg-yellow-500 text-gray-800 rounded-lg shadow-md transition duration-300 hover:bg-yellow-600 space-x-4"
          >
            <User className="w-8 h-8" />
            <div>
              <h3 className="font-semibold text-lg">Interviewer Login</h3>
              <p className="text-sm opacity-70">Access your interview dashboard</p>
            </div>
          </Link>
          <Link
            to="/user/register"
            className="flex items-center justify-start w-full p-4 bg-green-500 text-gray-800 rounded-lg shadow-md transition duration-300 hover:bg-green-600 space-x-4"
          >
            <UserPlus className="w-8 h-8" />
            <div>
              <h3 className="font-semibold text-lg">Interviewer Register</h3>
              <p className="text-sm opacity-70">Create your interviewer account</p>
            </div>
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-start w-full p-4 bg-blue-500 text-white rounded-lg shadow-md transition duration-300 hover:bg-blue-600 space-x-4"
          >
            <LayoutDashboard className="w-8 h-8" />
            <div>
              <h3 className="font-semibold text-lg">Admin Login</h3>
              <p className="text-sm opacity-70">Manage system settings</p>
            </div>
          </Link>
          <Link
            to="/register"
            className="flex items-center justify-start w-full p-4 bg-red-500 text-white rounded-lg shadow-md transition duration-300 hover:bg-red-600 space-x-4"
          >
            <Settings className="w-8 h-8" />
            <div>
              <h3 className="font-semibold text-lg">Admin Register</h3>
              <p className="text-sm opacity-70">Set up admin access</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
