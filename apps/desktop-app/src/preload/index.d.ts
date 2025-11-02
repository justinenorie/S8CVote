import { ElectronAPI } from "@electron-toolkit/preload";
import type {
  Election,
  Candidates,
  Student,
  CandidateResult,
} from "@renderer/types/api";

declare global {
  interface Window {
    electron: ElectronAPI;

    // Tandaan mo toh: Use for type safes for calling api (sige)
    electronAPI: {
      // RESULTS
      onEmailConfirmedURL: (callback) => Promise<void>;
      voteTalliesInsertMany: (rows: CandidateResult[]) => Promise<void>;
      voteTalliesDeleteByElectionId: (id: string) => Promise<void>;
      voteTalliesGetAll: () => Promise<>;
      voteTalliesGetUnsynced: () => Promise<>;
      voteTalliesMarkSynced: (ids: string[]) => Promise<void>;
      voteTalliesBulkUpsert: (records: CandidateResult[]) => Promise<void>;

      // PARTYLIST
      partylistGet: () => Promise<Partylist[]>;
      partylistAdd: (record: Partylist) => Promise<{ success: boolean }>;
      partylistUpdate: (
        id: string,
        updates: Partial<Partylist>
      ) => Promise<{ success: boolean }>;
      partylistDelete: (id: string) => Promise<{ success: boolean }>;
      partylistBulkUpsert: (
        records: Partylist[]
      ) => Promise<{ success: boolean }>;
      partylistGetUnsynced: () => Promise<Partylist[]>;
      partylistMarkSynced: (ids: string[]) => Promise<{ success: boolean }>;

      // Students
      studentsGet: () => Promise<Student[]>;
      studentsBulkInsert: (records: Student[]) => Promise<{ success: boolean }>;
      studentsGetUnsynced: () => Promise<Student[]>;
      studentsMarkSynced: (ids: string[]) => Promise<{ success: boolean }>;
      studentsBulkUpsert: (records: Student[]) => Promise<{ success: boolean }>;

      // Candidates
      candidatesGet: () => Promise<Candidates[]>;
      candidatesAdd: (data: Candidates) => Promise<void>;
      candidatesUpdate: (id: string, updates: Candidates) => Promise<void>;
      candidatesDelete: (id: string) => Promise<void>;
      candidatesGetUnsynced: () => Promise<Candidates[]>;
      candidatesMarkSynced: (ids: string[]) => Promise<{ success: boolean }>;
      candidatesBulkUpsert: (
        records: Candidates[]
      ) => Promise<{ success: boolean }>;
      talliesReplaceForElections: (
        records: CandidateResult[]
      ) => Promise<{ success: boolean }>;

      // Clean up for Candidates + Elections after sync
      cleanupRemovedRecords: () => Promise<void>;

      // Elections
      getElections: () => Promise<>;
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
