import React from "react";
import { Link } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";

const Navbar = ({ title, description }) => {
  return (
    <nav className=" bg-gradient-to-r from-blue-50 to-blue-100 shadow-md py-4 px-6">
      <div className="container mx-auto flex flex-row justify-between">
        {/* Logo or Home Link */}
        {/* <Link
          to="/"
          className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-300 group"
        >
          <Home
            className="text-blue-500 group-hover:rotate-12 transition-transform"
            size={24}
          />
          <span>Home</span>
        </Link> */}

        {/* Content passed as props */}
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-2 mt-10">
            {title}
          </h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
