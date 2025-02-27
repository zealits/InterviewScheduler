import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Grid as DashboardIcon,
  Calendar as CalendarIcon,
  User as ProfileIcon,
  LogOut as LogoutIcon,
  X as CloseIcon,
  Clock as PendingIcon,
  Settings as SettingsIcon,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  if (!isSidebarOpen) return null;

  const navigationItems = [
    {
      to: "/user/dashboard/availability",
      icon: CalendarIcon,
      label: "Availability",
      iconColor: "#4CAF50" // Green
    },
    {
      to: "/user/dashboard/pending-approvals",
      icon: PendingIcon,
      label: "Pending Approvals",
      iconColor: "#FF9800" // Orange
    },
    {
      to: "/user/dashboard/upcoming-interviews",
      icon: CalendarIcon,
      label: "Upcoming Interviews",
      iconColor: "#2196F3" // Blue
    },
    {
      to: "/user/dashboard/profile-update",
      icon: ProfileIcon,
      label: "Update Profile",
      iconColor: "#9C27B0" // Purple
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className="fixed top-0 left-0 h-full w-72 bg-white text-gray-800 shadow-2xl z-50 transform transition-all duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="p-6 relative border-b border-gray-200 ">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-6 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200 hover:rotate-90 transform"
            >
              <CloseIcon size={24} />
            </button>

            <div className="flex items-center space-x-3 ">
              <Link to="/user/dashboard/home">
                <div className="rounded-full">
                  <DashboardIcon
                    size={28}
                    className="text-gray-700"
                  />
                </div>
              </Link>
              <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
                Dashboard
              </h2>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-4 py-6 bg-gray-50">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                      ${
                        isActiveRoute(item.to)
                          ? "bg-gray-200 shadow-sm"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon
                        size={20}
                        style={{ color: item.iconColor }}
                        className="transition-colors duration-200"
                      />
                      <span className={`font-medium ${isActiveRoute(item.to) ? "text-gray-800" : "text-gray-700"}`}>
                        {item.label}
                      </span>
                    </div>
                    {item.badge && (
                      <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Section */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={() => {
                localStorage.removeItem("userEmail");
                window.location.href = "/user/login";
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-800 group"
            >
              <LogoutIcon size={20} className="text-red-500" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;