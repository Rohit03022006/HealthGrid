import axios from "axios";
import { getToken, logout } from "@/lib/auth";
import { API_TIMEOUT } from "@/lib/constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Request Interceptor
// Har request mein JWT token automatically add karo
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data, // Seedha data return karo
  (error) => {
    const status = error.response?.status;

    // Token expire ya invalid
    if (status === 401) {
      logout();
      return Promise.reject(error);
    }

    // Server down
    if (!error.response) {
      return Promise.reject({
        message: "Network error  - server unreachable",
      });
    }

    return Promise.reject(error.response.data);
  }
);

export default api;