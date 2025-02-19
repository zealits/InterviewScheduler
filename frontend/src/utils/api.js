import axios from "axios";

const API_BASE_URL = "api"; // Replace with your backend URL

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
  return response.data;
};

// export const fetchEvents = async () => {
//   const response = await axios.get(`${API_BASE_URL}/events`);
//   return response.data;
// };
export const registerUsers = async (userData) => {
  const endpoint = `/${API_BASE_URL}/auth/user/register`; // Adjust the endpoint based on your backend routing
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register user.");
    }

    return await response.json(); // Return the response data
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    throw error;
  }
};
export const loginUser2 = async (userData) => {
  try {
    const response = await axios.post(`/api/auth/user/login`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("authToken", response.data.token); // Save the token properly
    
    console.log(response.data);
    
    return response.data; // Return the response data if login is successful
  } catch (error) {
    // Handle error and rethrow to handle it in the calling function
    if (error.response) {
      // The request was made, and the server responded with a status code outside 2xx
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      // The request was made, but no response was received
      throw new Error("No response from server. Please try again later.");
    } else {
      // Something happened in setting up the request
      throw new Error(error.message || "An error occurred during login.");
    }
  }
};

export const getProfile = async () => {
  const response = await axios.get("/api/profile", {
    headers: { Authorization: `Bearer ${localStorage.getItem("userAuthToken")}` },
  });
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axios.put("/api/profile", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("userAuthToken")}` },
  });
  return response.data;
};
// Add a new interviewer
export const addInterviewer = async (interviewerData) => {
  const response = await axios.post(`${API_BASE_URL}/interviewers/add`, interviewerData);
  return response.data;
};
// Example API utility
// export const fetchAdminData = async (token) => {
//   const response = await fetch("/api/admin/dashboard", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch admin data");
//   }

//   return response.json();
// };

// Fetch all interviewers
