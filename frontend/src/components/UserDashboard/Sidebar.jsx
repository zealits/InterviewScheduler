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
    },
    {
      to: "/user/dashboard/pending-approvals",
      icon: PendingIcon,
      label: "Pending Approvals",
    },
    {
      to: "/user/dashboard/upcoming-interviews",
      icon: CalendarIcon,
      label: "Upcoming Interviews",
    },
    {
      to: "/user/dashboard/profile-update",
      icon: ProfileIcon,
      label: "Update Profile",
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className="fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="p-6 relative border-b border-gray-700">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-6 right-4 text-gray-400 hover:text-white transition-colors duration-200 hover:rotate-90 transform"
            >
              <CloseIcon size={24} />
            </button>

            <div className=" flex items-center space-x-3">
              <Link to="/user/dashboard/home">
                <div className=" from-blue-600 to-blue-800  rounded-full">
                  <DashboardIcon
                    size={28}
                    className="text-white from-blue-600 to-blue-800 "
                  />
                </div>
              </Link>
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Dashboard
              </h2>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                      ${
                        isActiveRoute(item.to)
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "hover:bg-gray-800 text-gray-300 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon
                        size={20}
                        className={
                          isActiveRoute(item.to)
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white"
                        }
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Section */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => {
                localStorage.removeItem("userEmail");
                window.location.href = "/user/login";
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white group"
            >
              <LogoutIcon size={20} className="text-white" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
