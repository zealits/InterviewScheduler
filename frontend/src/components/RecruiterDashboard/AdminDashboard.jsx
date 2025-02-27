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
import Sidebar from "../UserDashboard/Sidebar";
import { Menu } from "lucide-react";


const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const title = "Recruiter ";
  const description =
    "Manage interviews, track schedules, and optimize recruitment";

  return (
    
    <div className="bg-gradient-to-br from-blue-50 to-blue-100">
      <div className=" mx-auto ">
        <Navbar title={title}  />  
        
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
