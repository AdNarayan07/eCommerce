import axios from "axios";
import { generateConfig } from "../functions";

const API_URL = import.meta.env.VITE_API_URL + "/orders";

export const fetchOrder = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, generateConfig(token));
  return response.data;
};

export const fetchOrdersBySeller = async (token) => {
  const response = await axios.get(`${API_URL}/bySeller`, generateConfig(token));
  return response.data;
};

export const fetchOrdersByShopper = async (token) => {
  const response = await axios.get(`${API_URL}/byShopper`, generateConfig(token));
  return response.data;
};

export const cancel = async (id, token) => {
  const response = await axios.patch(`${API_URL}/${id}/cancel`, null, generateConfig(token));
  return response.data;
};

export const fetchAllOrders = async (token) => {
  const response = await axios.get(API_URL, generateConfig(token));
  return response.data;
};

export const updateOrderStatus = async (id, token, data) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, data, generateConfig(token));
  return response.data;
};