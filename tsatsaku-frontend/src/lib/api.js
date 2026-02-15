import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Log API URL for debugging
console.log('API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Defensive logging: serialize axios error fully so DevTools shows useful info
    try {
      // Print original error object (may include circular refs)
      console.error('API Error (raw):', error);

      // axios errors expose toJSON — prefer that when available
      const serialized = error.toJSON ? error.toJSON() : {
        message: error.message,
        name: error.name,
        config: error.config && { url: error.config.url, method: error.config.method },
        response: error.response && typeof error.response === 'object' ? {
          status: error.response.status,
          data: error.response.data
        } : undefined,
      };

      console.error('API Error (serialized):', serialized);
    } catch (logErr) {
      console.error('Failed to serialize API error:', logErr);
    }

    // Handle axios response errors
    if (error && error.response) {
      // If 401, clear auth and redirect
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
        }
      }

      // Prefer returning the server-provided error object
      return Promise.reject(error.response.data || {
        success: false,
        message: error.response.statusText || 'Server error'
      });
    }

    // No response received (network) or other error
    if (error && error.request) {
      console.error('No response received from API server; request:', error.request);
      return Promise.reject({ 
        success: false,
        message: 'Cannot connect to server. Please ensure the backend is running and reachable.' 
      });
    }

    // Fallback for unknown error shapes
    const fallbackMessage = (error && error.message) ? error.message : 'An unexpected error occurred';
    console.error('API Error (fallback):', fallbackMessage);
    return Promise.reject({ success: false, message: fallbackMessage });
  }
);

export default api;
