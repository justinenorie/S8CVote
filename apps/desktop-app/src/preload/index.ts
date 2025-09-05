// preload/index.ts
import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type { Api, LoginResponse } from "../renderer/src/types/api";

// Save All the API methods here
const api: Api = {
  login: (adminUser: string, password: string): Promise<LoginResponse> => {
    return ipcRenderer.invoke("auth:login", { adminUser, password });
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
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
