import { ipcMain } from "electron";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "./config";

console.log("🔑 BACKEND_URL (auth.ts):", process.env.BACKEND_URL);

// Create a dedicated axios instance
export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

let authToken: string | null = null; // Saving Token in main process memory
let refreshToken: string | null = null;

// ✅ Request interceptor: attach access token
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// ✅ Response interceptor: auto-refresh on 403
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 403 && refreshToken) {
      try {
        const refreshRes = await api.post("/api/auth/refreshAccess", {
          refreshToken,
        });

        if (refreshRes.data?.success) {
          authToken = refreshRes.data.token;

          // Retry the original request with the new token
          if (error.config) {
            error.config.headers = error.config.headers || {};
            error.config.headers["Authorization"] = `Bearer ${authToken}`;
            return api.request(error.config);
          }
        }
      } catch (refreshErr) {
        console.error("Refresh failed:", refreshErr);
        authToken = null;
        refreshToken = null;
      }
    }

    return Promise.reject(error);
  }
);

// ✅ IPC Handlers
export function registerAuthHandlers(): void {
  // LOGIN ADMIN
  ipcMain.handle("auth:login", async (_event, { adminUser, password }) => {
    try {
      const res = await api.post("/api/auth/admin/login", {
        adminUser,
        password,
      });

      if (res.data?.success) {
        authToken = res.data.token; // save token in memory
        refreshToken = res.data.refreshToken;
        console.log(refreshToken);
        return { success: true, message: "Login Success" };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  });

  // LOGOUT
  ipcMain.handle("auth:logout", async () => {
    try {
      const res = await api.post("/api/auth/logout", { refreshToken });

      if (res.data?.success) {
        authToken = null;
        refreshToken = null;
        return { success: true };
      } else {
        return { success: false, message: res.data?.message };
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return {
        success: false,
        message: error.response?.data?.message || "Logout failed",
      };
    }
  });
}

// Helpers
export function getAuthToken(): string | null {
  return authToken;
}

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

export function setRefreshToken(token: string | null): void {
  refreshToken = token;
}
