import axios from 'axios';

// For production, use a relative path to allow Vercel to proxy the request
const baseUrl = '/api'; // Always use relative path in production

// Create axios instance with common configuration
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true // Enable sending cookies with cross-origin requests
});

export default api;