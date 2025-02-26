import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div className="flex h-screen bg-black-500">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Toggle Sidebar Button */}

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        } overflow-y-auto`}
      >
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-40 p-4  bg-blue-500 text-white  shadow-lg  transition-all duration-300 ease-in-out rounded-full"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="max-w-8xl  ">
          <div className=" shadow-md rounded-lg backdrop-blur-lg">
            {/* Render Nested Routes */}
            <div className="mx-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
