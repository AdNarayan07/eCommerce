import axios from "axios";
import { generateConfig } from "../functions";

const API_URL = import.meta.env.VITE_API_URL + "/products";

export const fetchProducts = async (token) => {
  const response = await axios.get(API_URL, generateConfig(token));
  return response.data;
};

export const fetchProductsBySeller = async (token) => {
  const response = await axios.get(`${API_URL}/bySeller`, generateConfig(token));
  return response.data;
};

export const fetchProduct = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export const addProduct = async (product, token) => {
  const response = await axios.post(API_URL, product, generateConfig(token));
  return response.data;
}

export const removeProduct = async (productId, token) => {
  const response = await axios.delete(`${API_URL}/${productId}`, generateConfig(token));
  return response.data;
}

export const updateProduct = async (productId, data, token) => {
  const response = await axios.put(`${API_URL}/${productId}`, data, generateConfig(token));
  return response.data;
}

export const buyProduct = async (productId, data, token) => {
  const response = await axios.post(`${API_URL}/${productId}/buy`, data, generateConfig(token));
  return response.data
}

export const getComments = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}/comments`);
  return response.data
}

export const postComments = async (productId, data, token) => {
  const response = await axios.put(`${API_URL}/${productId}/comments`, data, generateConfig(token));
  return response.data
}