import React from "react";
import { Link } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Home Link */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-300 group"
        >
          <Home 
            className="text-blue-500 group-hover:rotate-12 transition-transform" 
            size={24} 
          />
          <span>Home</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;