import axios from "axios";
import { userAuth } from "../stores/useAuth";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // Pastikan server BE mengizinkan CORS dan cookie
});

export const refreshInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

// 1. Request Interceptor: Menyisipkan Token ke setiap request
axiosInstance.interceptors.request.use((config) => {
  // Jika Anda menyimpan token di localStorage
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Menangani Token Expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Cek status 401 dan pastikan belum melakukan retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Coba refresh token
        await refreshInstance.post("/auth/refresh");

        // Jika sukses, ulangi request awal
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Jika gagal refresh, logout user
        userAuth.getState().logout();
        window.location.href = "/login"; // Force redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
