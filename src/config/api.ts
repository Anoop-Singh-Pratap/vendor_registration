import axios from 'axios';

// For production, use the environment variable or default to the relative path
const baseURL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with common configuration
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

export default api;