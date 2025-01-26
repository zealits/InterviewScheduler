import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../utils/api";
import Modal from "../model/PopupForLogin";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
   const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      if (response) {
        const { token } = response;
        login(token); // Save the token
        // setModalData({ title: "Success", message: "Login successful!" });
        // setModalOpen(true);
        navigate("/admin"); 
        console.log(response)// Redirect to admin page
      }
    } catch (err) {
      // setModalData({ title: "Error", message: `${err}` });
      // setModalOpen(true);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div>
     <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    
    </div>
    </div>
  );
};

export default Login;
