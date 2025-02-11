import React from "react";

import LogoutButton from "./LogoutButton";

const Navbar = ({ title, onLogout }) => {

  

  return (
    <nav className="relative">
      {/* Background with gradient and glass effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-90" />

      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Title with animated underline */}
            <div className="group">
              <h1 className="text-2xl font-bold text-white tracking-wide">
                {title}
              </h1>
              <div className="h-0.5 w-0 group-hover:w-full bg-white transition-all duration-300 ease-in-out" />
            </div>

            {/* Right side with logout */}
            <div className="flex items-center">

              <LogoutButton onLogout={onLogout} />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-200 opacity-10 rounded-full blur-xl" />
      </div>
    </nav>
  );
};

export default Navbar;
