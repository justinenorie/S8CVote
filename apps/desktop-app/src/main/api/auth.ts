import { ipcMain } from "electron";
import axios, { AxiosError } from "axios";

let authToken: string | null = null; // Saving Token in main process memory

export function registerAuthHandlers(): void {
  ipcMain.handle("auth:login", async (_event, { adminUser, password }) => {
    try {
      const res = await axios.post(
        `${process.env.BACKEND_URL}/api/auth/admin/login`,
        {
          adminUser,
          password,
        }
      );

      if (res.data && res.data.success) {
        authToken = res.data.token; // ✅ save token in memory
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

  // TODO: Add more routes here
  // ipcMain.handle("auth:logout", ...)
}

export function getAuthToken(): string | null {
  return authToken;
}
