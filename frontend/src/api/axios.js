// src/api/axios.js
import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:8000";

// normalize: ensure no trailing slashes, ensure /api/ appended once
const normalized = String(rawBase || "").replace(/\/+$/, "");
const baseURL = normalized.endsWith("/api") ? normalized + "/" : normalized + "/api/";

// create axios instance
const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15s timeout
  // withCredentials: true, // enable if using cookie auth
});

// ======= Interceptors (basic) =======
API.interceptors.request.use(
  (config) => {
    // Example: add Authorization header if token saved in localStorage
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore localStorage access errors (e.g. SSR)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (res) => res,
  (error) => {
    // Basic unified error handling — you can extend this
    if (error.response) {
      // server responded with non-2xx
      // You could dispatch global notifications here
      // console.error("API error", error.response.status, error.response.data);
    } else if (error.request) {
      // request made but no response
      // console.error("No response from API", error.request);
    } else {
      // something else
      // console.error("Axios error", error.message);
    }
    return Promise.reject(error);
  }
);

// ======= Helpers =======
export function setAuthToken(token) {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try { localStorage.setItem("access_token", token); } catch (e) {}
  } else {
    delete API.defaults.headers.common["Authorization"];
    try { localStorage.removeItem("access_token"); } catch (e) {}
  }
}

export default API;
