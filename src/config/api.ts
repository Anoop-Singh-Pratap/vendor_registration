import axios from 'axios';

// For production, use direct API URL, no longer using CORS proxy
const baseUrl = import.meta.env.VITE_API_URL || '/api';
const useProxy = false; // Disabled CORS proxy usage

// Create axios instance with common configuration
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

export default api;