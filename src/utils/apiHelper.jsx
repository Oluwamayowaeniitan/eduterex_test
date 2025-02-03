import axios from "axios";
import { getToken } from "./tokenHelper"; // Correctly import getToken from the tokenHelper file

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response, // Pass successful responses as is
  (error) => {
    console.log("errorr", error.response.data.message);
    // Extract the error response
    if (error.response) {
      // Backend returned an error response (status code out of range 2xx)
      return Promise.reject(error.response.data); // Pass only the backend error message
    } else if (error.request) {
      // No response was received
      return Promise.reject({
        message: "No response from server. Please try again.",
      });
    } else {
      // Something else happened during the request setup
      return Promise.reject({ message: "Request error. Please try again." });
    }
  },
);

export const apiHelper = {
  post: (url, data) => api.post(url, data),
  get: (url) => api.get(url),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
};
