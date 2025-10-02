import { ElectronAPI } from "@electron-toolkit/preload";
import type { Election } from "../types/api";

declare global {
  interface Window {
    electron: ElectronAPI;

    // Tandaan mo toh: Use for type safes for calling api (sige)
    electronAPI: {
      // Elections
      getElections: () => Promise<Election>;
      addElection: (data: Election) => Promise<{ success: boolean }>;
      updateElection: (data: Election) => Promise<{ success: boolean }>;
      deleteElection: (id: string) => Promise<{ success: boolean }>;

      // // Logins
      adminLogin: (data: {
        id: string;
        email: string;
        role: string;
        access_token: string | null;
        refresh_token: string | null;
        created_at: string;
        updated_at: string;
      }) => Promise<void>;
      getAdminUser: () => Promise<void>;
      clearSession: () => Promise<void>;

      // Syncs
      getElectionSyncQueue: () => Promise<
        { electionId: string; operation: "create" | "update" | "delete" }[]
      >;
      clearElectionSyncQueue: (ids: string[]) => Promise<{ success: boolean }>;
    };
  }
}
