import React from "react";
import { Link } from "react-router-dom";
import { 
  Grid as DashboardIcon, // Changed to 'Grid' for Dashboard
  Calendar as CalendarIcon,
  User as ProfileIcon, // Changed to 'User' for Profile
  LogOut as LogoutIcon, // Correct casing for 'LogOut'
  X as CloseIcon // Corrected to 'X' for Close
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  if (!isSidebarOpen) return null;

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
      <div className="p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <CloseIcon size={24} />
        </button>

        {/* Header */}
        <div className="mb-8 flex items-center space-x-3">
          <Link to="/user/dashboard/home"><DashboardIcon size={32} className="text-blue-400" /></Link>
          <h2 className="text-2xl font-bold text-white tracking-wider">Dashboard</h2>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/user/dashboard/availability"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-blue-300 group"
              >
                <CalendarIcon size={20} className="text-gray-400 group-hover:text-blue-300" />
                <span className="font-medium">Availability</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user/dashboard/pending-approvals"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-blue-300 group"
              >
                <ProfileIcon size={20} className="text-gray-400 group-hover:text-blue-300" />
                <span className="font-medium">Pending Approvals</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user/dashboard/upcoming-interviews"

                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-blue-300 group"
              >
                <CalendarIcon size={20} className="text-gray-400 group-hover:text-blue-300" />
                <span className="font-medium">Upcoming Interviews</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user/dashboard/profile-update"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-blue-300 group"
              >
                <ProfileIcon size={20} className="text-gray-400 group-hover:text-blue-300" />
                <span className="font-medium">Update Profile</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("userEmail");
                  window.location.href = "/user/login";
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-600 hover:text-white group text-left"
              >
                <LogoutIcon size={20} className="text-gray-400 group-hover:text-white" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
