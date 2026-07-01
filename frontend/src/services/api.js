import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000") + "/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: false,
});

API.interceptors.request.use((config) => {
  const raw = localStorage.getItem("user");
  if (raw) {
    const token = JSON.parse(raw)?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getStoredUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function clearSessionAndRedirect() {
  localStorage.removeItem("user");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

let refreshPromise = null;

function refreshAccessToken(refreshToken) {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${BASE_URL}/auth/refresh/`, { refresh: refreshToken })
      .then(({ data }) => {
        const stored = getStoredUser();
        if (stored) {
          localStorage.setItem("user", JSON.stringify({ ...stored, token: data.access }));
        }
        return data.access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const url = config?.url || "";

    if (response?.status !== 401 || config._retry || url.includes("/auth/login") || url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    const stored = getStoredUser();
    if (!stored?.refreshToken) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    config._retry = true;
    try {
      const newAccessToken = await refreshAccessToken(stored.refreshToken);
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return API(config);
    } catch (refreshErr) {
      clearSessionAndRedirect();
      return Promise.reject(refreshErr);
    }
  }
);

export default API;
