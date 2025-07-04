import axios from 'axios';

// Base URL from the Swagger JSON
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Axios instance for API calls
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the Authorization header (e.g., after login)
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};
