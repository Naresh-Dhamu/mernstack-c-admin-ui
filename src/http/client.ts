import axios from "axios";
import { useAuthState } from "../store";
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const refreshToken = async () => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  );
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest.isRetry) {
      try {
        originalRequest.isRetry = true;
        const headers = { ...originalRequest.headers };
        await refreshToken();
        return api.request({ ...originalRequest, headers });
      } catch (err) {
        useAuthState.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
