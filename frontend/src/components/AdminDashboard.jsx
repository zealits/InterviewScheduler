import React from "react";
import Calendar from "./Calendar";
import { 
  Download, 
  FileSpreadsheet, 
  ChevronDown, 
  BarChart, 
  Users, 
  UserCheck 
} from "lucide-react";
// import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// import { fetchAdminData } from "../utils/api"; // Assume this fetches admin data
import Navbar from "./Navbar";
const AdminDashboard = () => {
 
 
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-5xl mx-auto p-6 mx-auto p-6">
         {/* Animated Header */}
         <Navbar/>
         <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Manage interviews, track schedules, and optimize recruitment
          </p>
        </div>

        {/* Calendar Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl  font-semibold text-blue-700 flex items-center">
                <UserCheck className="w-6 h-6 mr-2 text-blue-500 flex items-center" />
                Interview Calendar
              </h2>
            </div>
          <Calendar />
        </div>

        {/* Placeholder for Export Functionality */}
       
      </div>
    </div>
  );
};

export default AdminDashboard;
