import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="p-6 text-center">
        <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">
          Welcome to <span className="text-yellow-300">Interview Scheduler</span>
        </h1>
        <p className="mb-8 text-lg">
          Simplify and streamline your interview process with our scheduling tool.
        </p>
        <div className="space-y-4">
          <Link
            to="/user/login"
            className="block w-full max-w-xs px-6 py-3 text-lg font-medium text-center bg-yellow-400 text-gray-800 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
          >
            Interviewer Login
          </Link>
          <Link
            to="/user/register"
            className="block w-full max-w-xs px-6 py-3 text-lg font-medium text-center bg-green-400 text-gray-800 rounded-lg shadow-md hover:bg-green-500 transition duration-300"
          >
            Interviewer Register
          </Link>
          <Link to="/login" className="block w-full max-w-xs px-6 py-3 text-lg font-medium text-center bg-blue-400 text-gray-800 rounded-lg shadow-md hover:bg-blue-500 transition duration-300"> Admin Login </Link> 
          <Link to="/register" className="block w-full max-w-xs px-6 py-3 text-lg font-medium text-center bg-red-400 text-gray-800 rounded-lg shadow-md hover:bg-red-500 transition duration-300"> Admin Register </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
