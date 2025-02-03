import React, { useState } from 'react';
import { Home, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Simulate logout functionality
  const handleLogout = () => {
    console.log('Logout clicked');
    // Add your logout logic here
  };

  // Simulate navigation
  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    // Add your navigation logic here
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <div className="bg-white p-2 rounded-full transform group-hover:scale-110 transition-transform duration-300">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xl font-bold hidden md:block">DashBoard</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('/')}
              className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            >
              Home
            </button>
            <div className="relative group">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                Logout
              </button>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-500 transition-colors duration-300"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-500">
            <button
              onClick={() => handleNavigation('/')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors duration-300"
            >
              Home
            </button>
            <div className="px-3 py-2">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

