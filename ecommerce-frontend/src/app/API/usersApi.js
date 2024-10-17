import axios from "axios";
import { generateConfig } from "../../utils/functions";

const API_URL = import.meta.env.VITE_API_URL + "/users";

// Fetch the current user's details
export const fetchMe = async (token) => {
  const response = await axios.get(`${API_URL}/me`, generateConfig(token));
  return response.data;
};

// Edit the current user's details
export const editMe = async (token, data) => {
  const response = await axios.patch(`${API_URL}/me/details`, data, generateConfig(token));
  console.log(response.data); // Log the response for debugging
  return response.data;
};

// Change the current user's password
export const changePassword = async (token, data) => {
  const response = await axios.patch(`${API_URL}/me/password`, data, generateConfig(token));
  return response.data;
};

// Delete the current user's account
export const deleteAccount = async (token, data) => {
  const response = await axios.delete(`${API_URL}/me`, generateConfig(token, data));
  return response.data;
};

// Fetch all users
export const fetchAllUsers = async (token) => {
  const response = await axios.get(API_URL, generateConfig(token));
  return response.data;
};

// Edit a user's role by username
export const editUserRole = async (username, token, data) => {
  const response = await axios.patch(`${API_URL}/${username}/role`, data, generateConfig(token));
  return response.data;
};

// Delete a user by username
export const deleteUser = async (username, token) => {
  const response = await axios.delete(`${API_URL}/${username}`, generateConfig(token));
  return response.data;
};
