import axios from 'axios';

// For production, use a CORS proxy if needed
const baseUrl = import.meta.env.VITE_API_URL || '/api';
const useProxy = true; // Set to false when backend CORS is fixed

// Use a public CORS proxy or your own proxy
const proxyUrl = 'https://corsproxy.io/?';
const finalBaseURL = useProxy && baseUrl.startsWith('http') 
  ? `${proxyUrl}${encodeURIComponent(baseUrl)}`
  : baseUrl;

// Create axios instance with common configuration
const api = axios.create({
  baseURL: finalBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

export default api;