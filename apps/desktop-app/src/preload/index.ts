import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Save All the API methods here
const api = {
  // STUDENTS
  studentsGet: () => ipcRenderer.invoke("students:get"),
  studentsBulkInsert: (records) =>
    ipcRenderer.invoke("students:bulkInsert", records),
  studentsGetUnsynced: () => ipcRenderer.invoke("students:getUnsynced"),
  studentsMarkSynced: (ids) => ipcRenderer.invoke("students:markSynced", ids),
  studentsBulkUpsert: (records) =>
    ipcRenderer.invoke("students:bulkUpsert", records),

  // CANDIDATES
  candidatesGet: () => ipcRenderer.invoke("candidates:get"),
  candidatesAdd: (data) => ipcRenderer.invoke("candidates:add", data),
  candidatesUpdate: (id, updates) =>
    ipcRenderer.invoke("candidates:update", id, updates),
  candidatesDelete: (id) => ipcRenderer.invoke("candidates:delete", id),
  candidatesGetUnsynced: () => ipcRenderer.invoke("candidates:getUnsynced"),
  candidatesMarkSynced: (ids: string[]) =>
    ipcRenderer.invoke("candidates:markSynced", ids),
  candidatesBulkUpsert: (records) =>
    ipcRenderer.invoke("candidates:bulkUpsert", records),

  // ELECTIONS
  getElections: () => ipcRenderer.invoke("elections:get"),
  addElection: (data) => ipcRenderer.invoke("elections:add", data),
  updateElection: (id, updates) =>
    ipcRenderer.invoke("elections:update", id, updates),
  deleteElection: (id) => ipcRenderer.invoke("elections:delete", id),
  getUnsyncedElections: () => ipcRenderer.invoke("elections:getUnsynced"),
  markElectionsSynced: (ids: string[]) =>
    ipcRenderer.invoke("elections:markSynced", ids),
  bulkUpsertElections: (records) =>
    ipcRenderer.invoke("elections:bulkUpsert", records),

  // AUTH
  adminLogin: (data: { id: string; email: string }) =>
    ipcRenderer.invoke("auth:admin", data),
  getAdminUser: () => ipcRenderer.invoke("auth:getUser"),
  clearSession: () => ipcRenderer.invoke("auth:clearSession"),

  // REGISTRATION
  // TODO: add the registration method here later on.
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
