import { ElectronAPI } from "@electron-toolkit/preload";
import type { Election } from "@renderer/types/api";

declare global {
  interface Window {
    electron: ElectronAPI;

    // Tandaan mo toh: Use for type safes for calling api (sige)
    electronAPI: {
      // Candidates
      candidatesGet: () => Promise<Candidate[]>;
      candidatesAdd: (data: Candidate) => Promise<void>;
      candidatesUpdate: (id: string, updates: Candidate) => Promise<void>;
      candidatesDelete: (id: string) => Promise<void>;
      candidatesGetUnsynced: () => Promise<Candidate[]>;
      candidatesMarkSynced: (ids: string[]) => Promise<{ success: boolean }>;
      candidatesBulkUpsert: (
        records: Candidate[]
      ) => Promise<{ success: boolean }>;

      // Elections
      getElections: () => Promise<Election>;
      addElection: (data: Election) => Promise<void>;
      updateElection: (id, updates: Election) => Promise<void>;
      deleteElection: (id: string) => Promise<void>;
      getUnsyncedElections: () => Promise<Election[]>;
      markElectionsSynced: (ids) => Promise<{ success: boolean }>;
      bulkUpsertElections: (records) => Promise<{ success: boolean }>;

      // Logins
      adminLogin: (data: {
        id: string;
        email: string;
        role: string;
        fullname: string;
        access_token: string | null;
        refresh_token: string | null;
        created_at: string;
        updated_at: string;
      }) => Promise<void>;
      getAdminUser: () => Promise<void>;
      clearSession: () => Promise<void>;
    };
  }
}
