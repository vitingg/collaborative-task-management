import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { publicApi } from "./public-api";

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const privateApi = axios.create();

privateApi.defaults.baseURL = publicApi.defaults.baseURL;

privateApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      error.response?.status !== 401 ||
      originalRequest.url === "/auth/refresh" ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {}).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        originalRequest._retry = true; //
        return privateApi(originalRequest);
      });
    }

    isRefreshing = true;
    const { refreshToken, logout, setToken } = useAuthStore.getState();

    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    try {
      const response = await publicApi.post("/auth/refresh", { refreshToken });

      const { token: newAccessToken } = response.data;

      setToken({ token: newAccessToken });

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      originalRequest._retry = true;

      processQueue(null, newAccessToken);

      return privateApi(originalRequest);
    } catch (refreshError: any) {
      processQueue(refreshError, null);
      logout();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { privateApi };
