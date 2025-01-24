import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
  });

  // Restore token from localStorage on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth({ isAuthenticated: true, token });
    }
  }, []);

  const login = (token) => {
    setAuth({ isAuthenticated: true, token });
    localStorage.setItem("token", token); // Save token to localStorage
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, token: null });
    localStorage.removeItem("token"); // Clear token from localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
