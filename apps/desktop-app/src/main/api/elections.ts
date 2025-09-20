import { ipcMain } from "electron";
import { api } from "./auth";

export function registerElectionHandlers(): void {
  ipcMain.handle("elections:list", async () => {
    const res = await api.get("/api/admin/category");
    return res.data;
  });
}
