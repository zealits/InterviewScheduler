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

// Add a new interviewer
export const addInterviewer = async (interviewerData) => {
  const response = await axios.post(`${API_BASE_URL}/interviewers/add`, interviewerData);
  return response.data;
};

// Fetch all interviewers
