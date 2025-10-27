import axios from 'axios';

// Define the base URL for your API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

console.log('API URL:', API_URL);

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} for ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default apiClient; 