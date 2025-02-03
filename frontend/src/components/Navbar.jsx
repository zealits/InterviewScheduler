import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  return (
    <nav
      className="flex justify-between items-center p-4 shadow-lg"
      style={{ backgroundColor: "#e5f0ff" }}
    >
      {/* Logo or Home Link */}
      <div className="text-xl font-bold text-gray-800">
        <Link
          to="/"
          className="hover:text-blue-600 transition duration-300"
        >
          🏠 Home
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        {/* <Link
          to="/admin"
          className="text-lg text-gray-800 hover:text-blue-600 transition duration-300"
        >
          Admin Dashboard
        </Link> */}
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;