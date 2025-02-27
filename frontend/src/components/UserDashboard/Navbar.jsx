import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, LogOut, Menu, X, Bell, User, Settings } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const [interview, setInterview] = useState({});

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    window.location.href = "/user/login";
  };


  return (
    <nav className="bg-gray-800 text-gray-100 shadow-md p-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-semibold tracking-tight text-gray-100">
                UserDashboard
              </span>
            </div>
            
           
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
           
            
            <div className="ml-3 relative">
              <div className="flex items-center">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  <User size={18} className="mr-2 " />
                  {interview.name || userEmail || "Guest"}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white flex items-center"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

     
      
    </nav>
  );
};

export default Navbar;