import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  User, 
  Settings 
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userEmail = localStorage.getItem("userEmail");

  const NavLinks = [
    { 
      icon: <Home size={20} />, 
      label: "Home", 
      path: "/" 
    },
    { 
      icon: <User size={20} />, 
      label: "Profile", 
      path: "/user/dashboard/profile-update" 
    },
    { 
      icon: <Settings size={20} />, 
      label: "Settings", 
      path: "/user/settings" 
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    window.location.href = "/user/login";
  };

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition"
          >
            <Home className="text-blue-500" size={24} />
            <span className="hidden md:block">InterviewEase</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {NavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-600 transition">
              <Bell size={20} />
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50">
            <div className="flex flex-col p-4 space-y-3">
              {NavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-lg transition w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <div className="flex items-center space-x-3">
                <button className="text-gray-600 hover:text-blue-600">
                  <Bell size={20} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
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