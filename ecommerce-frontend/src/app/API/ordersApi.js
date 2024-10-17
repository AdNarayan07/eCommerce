import axios from "axios";
import { generateConfig } from "../../utils/functions"; // Importing the function to generate headers with the token

// Base URL for the orders API
const API_URL = import.meta.env.VITE_API_URL + "/orders"; // Using environment variable for API URL

// Function to fetch a specific order by ID
export const fetchOrder = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, generateConfig(token)); // Making GET request with token
  return response.data; // Returning the response data
};

// Function to fetch all orders by the seller
export const fetchOrdersBySeller = async (token) => {
  const response = await axios.get(`${API_URL}/bySeller`, generateConfig(token)); // GET request for seller's orders
  return response.data; // Returning the response data
};

// Function to fetch all orders by the shopper
export const fetchOrdersByShopper = async (token) => {
  const response = await axios.get(`${API_URL}/byShopper`, generateConfig(token)); // GET request for shopper's orders
  return response.data; // Returning the response data
};

// Function to cancel an order by ID
export const cancel = async (id, token) => {
  const response = await axios.patch(`${API_URL}/${id}/cancel`, null, generateConfig(token)); // PATCH request to cancel order
  return response.data; // Returning the response data
};

// Function to fetch all orders
export const fetchAllOrders = async (token) => {
  const response = await axios.get(API_URL, generateConfig(token)); // GET request for all orders
  return response.data; // Returning the response data
};

// Function to update the status of an order by ID
export const updateOrderStatus = async (id, token, data) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, data, generateConfig(token)); // PATCH request to update order status
  return response.data; // Returning the response data
};
