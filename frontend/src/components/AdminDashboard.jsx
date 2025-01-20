import React from "react";
import Calendar from "./Calendar";

const AdminDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>
      <Calendar />
      {/* Add export functionality here */}
    </div>
  );
};

export default AdminDashboard;
