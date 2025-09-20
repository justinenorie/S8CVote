import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type {
  Api,
  LoginResponse,
  ElectionResponse,
} from "../renderer/src/types/api";

// Save All the API methods here
const api: Api = {
  login: (adminUser: string, password: string): Promise<LoginResponse> => {
    return ipcRenderer.invoke("auth:login", { adminUser, password });
  },

  logout: async () => {
    return ipcRenderer.invoke("auth:logout");
  },

  getElections: async (): Promise<ElectionResponse> => {
    return ipcRenderer.invoke("elections:list");
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("config", {
      get: () => ipcRenderer.invoke("get-config"),
    });
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
