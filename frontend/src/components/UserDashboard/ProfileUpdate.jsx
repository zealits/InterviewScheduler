import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        alert("No email found in localStorage");
        return;
      }

      try {
        const response = await axios.get(`/api/user?email=${email}`);
        setUserData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/profile", userData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
  <div className="w-full max-w-4xl p-8 bg-white rounded-2xl">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
      Update Profile
    </h2>
    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-600">Name</label>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          required
          className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-600">Email</label>
        <input
          type="email"
          value={userData.email}
          disabled
          className="w-full p-3 mt-1 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-600">Password</label>
        <input
          type="password"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          required
          className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-600">LinkedIn Profile</label>
        <input
          type="url"
          value={userData.linkedinProfile}
          onChange={(e) => setUserData({ ...userData, linkedinProfile: e.target.value })}
          required
          className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-600">Years of Experience</label>
        <input
          type="number"
          value={userData.yearOfExperience}
          onChange={(e) => setUserData({ ...userData, yearOfExperience: e.target.value })}
          required
          className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-600">Experience as Interviewer</label>
        <input
          type="number"
          value={userData.experienceAsInterviewer}
          onChange={(e) =>
            setUserData({ ...userData, experienceAsInterviewer: e.target.value })
          }
          required
          className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-600">Candidates Interviewed</label>
        <input
          type="number"
          value={userData.candidatesInterviewed}
          onChange={(e) =>
            setUserData({ ...userData, candidatesInterviewed: e.target.value })
          }
          required
          className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-600">Specialization</label>
        <select
          value={userData.specialization}
          onChange={(e) =>
            setUserData({ ...userData, specialization: e.target.value })
          }
          required
          className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        >
          <option value="Cloud">Cloud</option>
          <option value="AI">AI</option>
          <option value="Language">Language</option>
          <option value="Domain">Domain</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Update Profile
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default UpdateProfile;
