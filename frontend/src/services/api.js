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

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    // Network error (server unreachable / offline)
    // Logout mat karo
    if (!error.response) {
      return Promise.reject({
        message: "Network error",
        isNetworkError: true,
      });
    }

    // Sirf genuine 401 pe logout karo
    // Offline case already upar handle ho chuka hai
    if (status === 401 && navigator.onLine) {
      logout();
    }

    return Promise.reject(
      error.response?.data || {
        message: "Something went wrong",
      },
    );
  },
);

export default api;
