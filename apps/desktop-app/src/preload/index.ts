import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Save All the API methods here
const api = {
  // Elections
  getElections: () => ipcRenderer.invoke("get-elections"),
  addElection: (data) => ipcRenderer.invoke("add-election", data),
  updateElection: (data) => ipcRenderer.invoke("update-election", data),
  deleteElection: (id) => ipcRenderer.invoke("delete-election", id),

  // Auth
  adminLogin: (data: { id: string; email: string }) =>
    ipcRenderer.invoke("auth:admin", data),
  getAdminUser: () => ipcRenderer.invoke("auth:getUser"),
  clearSession: () => ipcRenderer.invoke("auth:clearSession"),

  // Sync helpers
  getElectionSyncQueue: () => ipcRenderer.invoke("get-election-sync-queue"),
  clearElectionSyncQueue: (ids: string[]) =>
    ipcRenderer.invoke("clear-election-sync-queue", ids),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("config", {
      get: () => ipcRenderer.invoke("get-config"),
    });
    contextBridge.exposeInMainWorld("electronAPI", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
