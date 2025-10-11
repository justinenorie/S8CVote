import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Save All the API methods here
const api = {
  // Elections
  getElections: () => ipcRenderer.invoke("elections:get"),
  addElection: (data) => ipcRenderer.invoke("elections:add", data),
  updateElection: (id, updates) =>
    ipcRenderer.invoke("elections:update", id, updates),
  deleteElection: (id) => ipcRenderer.invoke("elections:delete", id),

  // Sync helpers
  getElectionSyncQueue: () =>
    ipcRenderer.invoke("elections:get-election-sync-queue"),
  clearElectionSyncQueue: (ids: string[]) =>
    ipcRenderer.invoke("elections:clear-election-sync-queue", ids),
  getUnsyncedElections: () => ipcRenderer.invoke("elections:getUnsynced"),
  markElectionsSynced: (ids: string[]) =>
    ipcRenderer.invoke("elections:markSynced", ids),

  // Auth
  adminLogin: (data: { id: string; email: string }) =>
    ipcRenderer.invoke("auth:admin", data),
  getAdminUser: () => ipcRenderer.invoke("auth:getUser"),
  clearSession: () => ipcRenderer.invoke("auth:clearSession"),
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
