import React from "react";
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Optionally, navigate to login or home page
  };

  return <button className="bg-red-200 p-3 rounded-2xl" onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
