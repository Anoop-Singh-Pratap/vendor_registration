import axios from 'axios';

// For production, use a relative path to allow Vercel to proxy the request
const baseUrl = import.meta.env.DEV 
  ? import.meta.env.VITE_API_URL 
  : '/api'; // Use relative path in production

// Create axios instance with common configuration
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

export default api;