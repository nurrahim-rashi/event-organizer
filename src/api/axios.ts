import axios from "axios";
import { userAuth } from "../stores/useAuth";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      userAuth.getState().logout();
      alert("Your session has ended. Please log in again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
