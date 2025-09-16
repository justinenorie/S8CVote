import { ipcMain } from "electron";
import axios from "axios";

export function registerElectionHandlers(): void {
  ipcMain.handle("elections:list", async () => {
    const res = await axios.get(`${process.env.BACKEND_URL}/api/elections`);
    return res.data;
  });
}
