import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
// import the new component

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Initially Closed
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <main
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

        <div className="max-w-8xl">
          <Navbar title={`Welcome ${userEmail}`} onLogout={() => {}} />
          <div className="">
            {/* Render Nested Routes */}
            <div className="">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
