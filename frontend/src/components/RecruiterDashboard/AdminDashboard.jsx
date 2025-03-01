import React from "react";
import Calendar from "./Calendar";
import {
  Download,
  FileSpreadsheet,
  ChevronDown,
  BarChart,
  Users,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
// import { fetchAdminData } from "../utils/api"; // Assume this fetches admin data
import Navbar from "../Navbar";
import Sidebar from "../RecruiterDashboard/Sidebar";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const title = "Recruiter ";
  const description =
    "Manage interviews, track schedules, and optimize recruitment";

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100">
      <div className=" mx-auto ">
        {/* Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Navbar title={title} />

        {/* Calendar Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div
            className={`flex-1 transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "md:ml-64" : "ml-0"
            } overflow-y-auto`}
          >
            {/* Sidebar Toggle Button */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-4 left-4 z-40 p-3 bg-white shadow-lg transition-all duration-300 ease-in-out rounded-full hover:bg-gray-200"
              >
                <Menu size={26} className="text-gray-800" />{" "}
                {/* Icon Color Applied */}
              </button>
            )}
            {/* <h2 className="text-xl  font-semibold text-blue-700 flex items-center">
                <UserCheck className="w-6 h-6 mr-2 text-blue-500 flex items-center" />
                Interview Calendar
              </h2> */}
          </div>
          <Calendar />
        </div>

        {/* Placeholder for Export Functionality */}
      </div>
    </div>
  );
};

export default AdminDashboard;
