import axios from "axios";
import { generateConfig } from "../functions";

const API_URL = import.meta.env.VITE_API_URL + "/users";

export const fetchMe = async (token) => {
  const response = await axios.get(`${API_URL}/me`, generateConfig(token));
  return response.data;
};

export const editMe = async (token, data) => {
  const response = await axios.patch(`${API_URL}/me/details`, data, generateConfig(token));
  console.log(response.data);
  return response.data;
};

export const changePassword = async (token, data) => {
  const response = await axios.patch(`${API_URL}/me/password`, data, generateConfig(token));
  return response.data;
};

export const deleteAccount = async (token, data) => {
  const response = await axios.delete(`${API_URL}/me`, generateConfig(token, data));
  return response.data;
};

export const fetchAllUsers = async (token) => {
  const response = await axios.get(API_URL, generateConfig(token));
  return response.data;
};

export const editUserRole = async (username, token, data) => {
  const response = await axios.patch(`${API_URL}/${username}/role`, data, generateConfig(token));
  return response.data;
};

export const deleteUser = async (username, token) => {
  const response = await axios.delete(`${API_URL}/${username}`, generateConfig(token));
  return response.data;
};
