import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom"; // Outlet added for nested routes
import Navbar from "./Navbar";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isSidebarOpen && (
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <ul className="space-y-4">
              <li>
                <Link to="/user/dashboard/availability" className="block text-gray-300 hover:text-white">
                  Availability
                </Link>
              </li>
              <li>
                <Link to="/user/dashboard/upcoming-interviews" className="block text-gray-300 hover:text-white">
                  Upcoming Interviews
                </Link>
              </li>
              <li>
                <Link to="/user/dashboard/profile-update" className="block text-gray-300 hover:text-white">
                  Update Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem("userEmail");
                    window.location.href = "/user/login"; // Redirect to login
                  }}
                  className="block text-gray-300 hover:text-white w-full text-left"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
          {/* Close Sidebar Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </aside>
      )}

      {/* Toggle Sidebar Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-gray-900 text-white rounded-md m-4 hover:bg-gray-700"
        >
          Open Sidebar
        </button>
      )}

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Navbar />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {userEmail || "User"}</h1>
          {/* Render Nested Routes */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
