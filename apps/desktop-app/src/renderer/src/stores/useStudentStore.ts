import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";
import { useAuthStore } from "./useAuthStore";
import { Student } from "@renderer/types/api";
import * as XLSX from "@e965/xlsx";

type Result<T = void> =
  | { data: T; error: null }
  | { data: null; error: string };

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;

  syncing: boolean;
  syncError: string | null;
  lastSyncedAt: string | null;
  lastChangedAt: string | null;

  fetchStudents: () => Promise<Result<Student[]>>;
  handleExcelUpload: (file: File) => Promise<Result<null>>;
  syncToServerStudents: () => Promise<Result<null>>;
  syncFromServerStudents: () => Promise<Result<null>>;
  fullSyncStudents: () => Promise<Result<null>>;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  loading: false,
  error: null,

  syncing: false,
  syncError: null,
  lastSyncedAt: null,
  lastChangedAt: null,

  fetchStudents: async () => {
    set({ loading: true, error: null });

    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    try {
      set({ loading: true });
      const rows = await window.electronAPI.studentsGet();

      const students: Student[] = (rows as Student[]).map((r) => ({
        id: r.id,
        student_id: r.student_id,
        fullname: r.fullname,
        email: r.email,
        isRegistered: Number(r.isRegistered ?? 0),
        // created_at: r.created_at,
        // updated_at: r.updated_at,
        // deleted_at: r.deleted_at,
        // // if you typed synced_at as string in your type, coerce here:
        // synced_at:
        //   typeof r.synced_at === "number" ? String(r.synced_at) : r.synced_at,
      }));

      set({ students, loading: false });
      return { data: students, error: null };
    } catch (error: unknown) {
      console.error("Fetch students error:", error);
      set({ error: error as string, loading: false });
    }

    return { data: null, error: "" };
  },

  handleExcelUpload: async (file) => {
    try {
      set({ loading: true });

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // row validator
      const valid = (rows as Student[]).filter(
        (r) => r.fullname && r.student_id
      );
      if (valid.length === 0)
        throw new Error("Missing fullname/student_id columns");

      const data = (rows as Student[]).map((r) => ({
        id: crypto.randomUUID(),
        student_id: String(r.student_id).trim(),
        fullname: String(r.fullname).trim(),
        email: r.email,
        // isRegistered: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced_at: 0,
      }));

      await window.electronAPI.studentsBulkInsert(data);
      set({ lastChangedAt: new Date().toISOString() });
      await get().fetchStudents();

      set({ loading: false });
      return { data: null, error: null };
    } catch (error: unknown) {
      console.error("Fetch elections error:", error);
      set({ error: error as string, loading: false });
    }

    return { data: null, error: "" };
  },

  syncToServerStudents: async () => {
    try {
      const unsynced = await window.electronAPI.studentsGetUnsynced();
      if (!unsynced?.length) return { data: null, error: null };

      const { error } = await supabase
        .from("students")
        .upsert(unsynced, { onConflict: "student_id" });

      if (!error) {
        const ids = unsynced.map((s) => s.id);
        await window.electronAPI.studentsMarkSynced(ids);
      }
      return { data: null, error: error?.message ?? null };
    } catch (error: unknown) {
      console.error("Sync students error:", error);
      set({ error: error as string, loading: false });
    }
    return { data: null, error: "" };
  },

  syncFromServerStudents: async () => {
    try {
      const { data, error } = await supabase.from("students").select("*");
      if (error) return { data: null, error: error.message };

      await window.electronAPI.studentsBulkUpsert(data);
      await get().fetchStudents();

      return { data: null, error: null };
    } catch (error: unknown) {
      console.error("Sync elections error:", error);
      set({ error: error as string, loading: false });
    }

    return { data: null, error: "" };
  },

  fullSyncStudents: async () => {
    try {
      set({ syncing: true });
      await get().syncFromServerStudents();
      await get().syncToServerStudents();
      set({ lastSyncedAt: new Date().toISOString() });
      return { data: null, error: null };
    } catch (error: unknown) {
      console.error("Sync elections error:", error);
      set({ error: error as string, loading: false });
    } finally {
      set({ syncing: false });
    }

    return { data: null, error: "" };
  },
}));
