import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
import { User, Session } from "@supabase/supabase-js";
import { saveAdminSession, clearAdminSession } from "@/db/queries/authQuery";

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
    // Load the session from Supabase (AsyncStorage)
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      set({
        user: data.session.user,
        session: data.session,
        loading: false,
      });
    } else {
      set({ user: null, session: null, loading: false });
    }

    // Subscribe to auth state changes (auto-login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          set({ user: session.user, session });
        } else {
          set({ user: null, session: null });
        }
      }
    );

    // Clean up listener when store unmounts
    return new Promise<void>((resolve) => {
      listener.subscription.unsubscribe();
      resolve();
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    await clearAdminSession();
    // TODO: signOut SQLite
    set({ user: null, session: null, adminData: null });
  },
}));
