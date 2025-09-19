import { ipcMain } from "electron";
import axios from "axios";
import { getAuthToken } from "./auth";

export function registerElectionHandlers(): void {
  ipcMain.handle("elections:list", async () => {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");

    const res = await axios.get(
      `${process.env.BACKEND_URL}/api/admin/category`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  });
}
