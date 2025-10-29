import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Save All the API methods here
const api = {
  // RESULTS
  voteTalliesInsertMany: (rows) =>
    ipcRenderer.invoke("voteTallies:insertMany", rows),
  voteTalliesGetAll: () => ipcRenderer.invoke("voteTallies:getAll"),
  voteTalliesGetUnsynced: () => ipcRenderer.invoke("voteTallies:getUnsynced"),
  voteTalliesMarkSynced: (ids) =>
    ipcRenderer.invoke("voteTallies:markSynced", ids),
  voteTalliesBulkUpsert: (records) =>
    ipcRenderer.invoke("voteTallies:bulkUpsert", records),

  // PARTYLIST
  partylistGet: () => ipcRenderer.invoke("partylist:get"),
  partylistAdd: (record) => ipcRenderer.invoke("partylist:add", record),
  partylistUpdate: (id, updates) =>
    ipcRenderer.invoke("partylist:update", id, updates),
  partylistDelete: (id) => ipcRenderer.invoke("partylist:delete", id),
  // Sync helpers
  partylistBulkUpsert: (records) =>
    ipcRenderer.invoke("partylist:bulkUpsert", records),
  partylistGetUnsynced: () => ipcRenderer.invoke("partylist:getUnsynced"),
  partylistMarkSynced: (ids) => ipcRenderer.invoke("partylist:markSynced", ids),

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
  talliesReplaceForElections: (records) =>
    ipcRenderer.invoke("tallies:replaceForElections", records),

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

  // Clean up for Candidates + Elections after sync
  cleanupRemovedRecords: () => ipcRenderer.invoke("cleanup:removedRecords"),

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
