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
    <nav className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md">
      <div className="mx-auto  flex justify-between items-center relative">
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <header className="bg-gradient-to-r from-blue-600 to-blue-800 w-full text-white p-6 shadow-lg ">
        <div className="max-w-8xl  flex justify-between items-center">
        <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition"
          >
            <span className="text-3xl mx-auto font-bold"> Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className=" rounded-full bg-white/20 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <span className="text-white font-medium">{interview.name}</span>
            </div>
          </div>
        </div>
      </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50">
            <div className="flex flex-col p-4 space-y-3">
              {NavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-lg transition w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="flex items-center space-x-3">
                <button className="text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md">
                  <Bell size={20} />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
