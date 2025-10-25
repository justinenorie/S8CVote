import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
import { User, Session } from "@supabase/supabase-js";
import {
  saveAdminSession,
  clearAdminSession,
  loadAdminSession,
} from "@/db/queries/authQuery";

interface AdminData {
  id: string;
  fullname: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  adminData: AdminData | null;
  loading: boolean;
  error: string | null;

  signIn: (email: string, password: string) => Promise<void>;
  loadSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  adminData: null,
  loading: false,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      set({ error: error?.message ?? "Login failed", loading: false });
      return;
    }

    const { user, session } = data;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, fullname")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      set({ error: "Profile not found", loading: false });
      return;
    }

    if (profile.role !== "admin") {
      await supabase.auth.signOut();
      set({ user: null, session: null, adminData: null, loading: false });
      set({ error: "Only admins can login" });
      return;
    }

    const adminData: AdminData = {
      id: user.id,
      email: user.email!,
      fullname: profile.fullname,
      role: profile.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store in local SQLite
    await saveAdminSession({
      id: user.id,
      fullname: profile.fullname,
      email: user.email!,
      role: profile.role,
      access_token: session.access_token,
      refresh_token: session.refresh_token ?? "",
    });

    set({
      user,
      session,
      adminData,
      loading: false,
      error: null,
    });
  },

  loadSession: async () => {
    set({ loading: true });

    try {
      // Try loading from local SQLite first (offline-first)
      const localAdmin = await loadAdminSession();
      if (localAdmin) {
        set({
          user: { id: localAdmin.id, email: localAdmin.email } as any,
          session: {
            access_token: localAdmin.access_token,
            refresh_token: localAdmin.refresh_token,
          } as any,
          adminData: {
            id: localAdmin.id,
            fullname: localAdmin.fullname!,
            email: localAdmin.email!,
            role: localAdmin.role!,
            created_at: localAdmin.created_at!,
            updated_at: localAdmin.updated_at!,
          },
          loading: false,
        });
        return;
      }

      // If no local session, check Supabase (online mode)
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (data?.session) {
        set({
          user: data.session.user,
          session: data.session,
          loading: false,
        });

        // Auto-save for offline access next time
        await saveAdminSession({
          id: data.session.user.id,
          fullname: data.session.user.user_metadata?.fullname ?? "",
          email: data.session.user.email!,
          role: data.session.user.user_metadata?.role ?? "admin",
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token ?? "",
        });
      } else {
        set({ user: null, session: null, loading: false });
      }

      // Listen for auth changes (only while online)
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session) {
            set({ user: session.user, session });
          } else {
            set({ user: null, session: null });
          }
        }
      );

      return new Promise<void>((resolve) => {
        listener.subscription.unsubscribe();
        resolve();
      });
    } catch (err) {
      console.error("loadSession error:", err);
      set({ user: null, session: null, loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    await clearAdminSession();
    set({ user: null, session: null, adminData: null });
  },
}));
