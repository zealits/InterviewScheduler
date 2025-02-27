import React, { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";

const Navbar = ({ title, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  return (
    <nav className={`relative ${scrolled ? 'shadow-lg' : ''} transition-all duration-300`}>
      {/* Background with enhanced gray gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 opacity-95" />

      {/* Enhanced glass overlay with pattern */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white bg-opacity-5">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Title with enhanced animated underline */}
            <div className="group flex items-center space-x-2">
              <div className="h-8 w-1 bg-gradient-to-b from-gray-300 to-transparent rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">
                  {title}
                </h1>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-gray-300 to-white transition-all duration-300 ease-in-out" />
              </div>
            </div>

            {/* Right side with logout and added navigation */}
            <div className="flex items-center space-x-6">
           
              <div className="h-8 w-px bg-gray-500 opacity-30 hidden md:block" />
              <LogoutButton onLogout={onLogout} />
            </div>
          </div>
        </div>

        {/* Enhanced decorative elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-5 rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-40 h-40 bg-gray-300 opacity-5 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 w-24 h-24 bg-gray-400 opacity-5 rounded-full blur-lg" />
      </div>
    </nav>
  );
};

export default Navbar;