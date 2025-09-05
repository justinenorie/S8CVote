import type { Api } from "./types/api";

declare global {
  interface Window {
    api: Api;
  }
}

export {};
