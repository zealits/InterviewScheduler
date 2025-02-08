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
import { useAuth } from "../context/AuthContext";
// import { fetchAdminData } from "../utils/api"; // Assume this fetches admin data
import Navbar from "./Navbar";
import Sidebar from "./UserDashboard/Sidebar";
import { Menu } from "lucide-react";


const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const title = "Recruiter Dashboard";
  const description =
    "Manage interviews, track schedules, and optimize recruitment";

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100">
      <div className=" mx-auto p-6">
        {/* Animated Header */}
        <Navbar className="flex justify-center animate-fade-in-down" title={title} description={description} />
        {/* <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        /> */}

        {/* Toggle Sidebar Button */}
        {/* {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-40 p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out"
          >
            <Menu size={24} />
          </button>
        )} */}

        {/* Calendar Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between ">
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
