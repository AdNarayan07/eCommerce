import axios from 'axios';

// Base URL for the authentication API
const API_URL = import.meta.env.VITE_API_URL + "/auth"; // Using environment variable for API URL

// Function to handle user login
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials); // Making a POST request to login endpoint
  return response.data; // Returning the response data from the server
};

// Function to handle user registration
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData); // Making a POST request to register endpoint
  return response.data; // Returning the response data from the server
};
