import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Toggle Sidebar Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:ml-64' : 'ml-0'
        } overflow-y-auto`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         
          
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            
            

            {/* Render Nested Routes */}
            <div className="mt-4">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;