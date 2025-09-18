import { ipcMain } from "electron";
import axios, { AxiosError } from "axios";

let authToken: string | null = null;

export function registerAuthHandlers(): void {
  ipcMain.handle("get-config", () => {
    return { BACKEND_URL: process.env.BACKEND_URL };
  });

  ipcMain.handle("auth:login", async (_event, { adminUser, password }) => {
    try {
      const res = await axios.post(
        `${process.env.BACKEND_URL}/api/auth/admin/login`,
        { adminUser, password }
      );

      if (res.data && res.data.success) {
        authToken = res.data.token;
        return { success: true, token: authToken };
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
  // you can add more routes here like:
  // ipcMain.handle("auth:logout", ...)
}
