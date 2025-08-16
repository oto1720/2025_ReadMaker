import Constants from 'expo-constants';

// API Base URL configuration
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Development vs Production API endpoints
export const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development mode - use local server
    return 'http://localhost:3000';
  } else {
    // Production mode - use Railway URL
    return Constants.expoConfig?.extra?.apiBaseUrl || 'https://readmaker-api-production.up.railway.app';
  }
};

export default API_BASE_URL;