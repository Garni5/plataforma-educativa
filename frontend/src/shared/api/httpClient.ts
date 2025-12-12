import axios from "axios";
import { ENV } from "../../core/config/env";

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptor para incluir el token automáticamente
http.interceptors.request.use((config) => {
  console.log("holam mundo");
  const token = localStorage.getItem("token"); // o sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("holam mundo");
      // Token inválido o expirado → limpiar sesión
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);