import React from "react";
import Calendar from "./Calendar";

const AdminDashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <h1 className="text-3xl font-extrabold text-center mb-8 text-blue-600">
          Admin Dashboard
        </h1>

        {/* Calendar Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Calendar Overview
          </h2>
          <Calendar />
        </div>

        {/* Placeholder for Export Functionality */}
       
      </div>
    </div>
  );
};

export default AdminDashboard;
