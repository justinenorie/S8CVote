import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";

export interface Admin {
  id: string;
  fullname: string;
  email: string;
  role: string;
  is_approved: boolean;
  approved_at: string | null;
  created_at: string;
}

interface AdminStore {
  pendingAdmins: Admin[];
  verifiedAdmins: Admin[];
  loading: boolean;
  error: string | null;

  fetchAdmins: () => Promise<void>;
  approveAdmin: (id: string) => Promise<void>;
  rejectAdmin: (id: string) => Promise<void>;
}

export const useAdminsStore = create<AdminStore>((set, get) => ({
  pendingAdmins: [],
  verifiedAdmins: [],
  loading: false,
  error: null,

  fetchAdmins: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, fullname, email, role, is_approved, approved_at, created_at, status"
      )
      .eq("role", "admin")
      .order("created_at", { ascending: false });

    if (error) return set({ loading: false, error: error.message });

    const formattedData = data.map((admin) => ({
      ...admin,
      created_at: formatDateTime(admin.created_at),
      approved_at: formatDateTime(admin.approved_at),
    }));

    const pending = formattedData.filter((a) => a.status === "pending");
    const verified = formattedData.filter((a) => a.status === "approved");

    set({ pendingAdmins: pending, verifiedAdmins: verified, loading: false });
  },

  approveAdmin: async (id) => {
    await supabase
      .from("profiles")
      .update({
        status: "approved",
        is_approved: true,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id);
    await get().fetchAdmins();
  },

  rejectAdmin: async (id) => {
    await supabase
      .from("profiles")
      .update({
        status: "rejected",
        approved_at: null,
      })
      .eq("id", id);
    await get().fetchAdmins();
  },
}));

function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "—"; // graceful fallback

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long", // e.g. November
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // for AM/PM
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}
