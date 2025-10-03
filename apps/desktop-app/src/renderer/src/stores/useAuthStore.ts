import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

export type SignInResult =
  | { data: null; error: string }
  | { data: null; error: null }
  | { data: { user: User; session: Session }; error: null };

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;

  // Actions
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

// Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  // SIGN IN WITH PASSWORD
  signInWithPassword: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ error: error.message, loading: false });
      return { data: null, error: error.message };
    }

    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        set({ error: "Profile not found", loading: false });
        return { data: null, error: "Profile not found" };
      }

      if (profile.role !== "admin") {
        await supabase.auth.signOut();
        set({ user: null, session: null, loading: false });
        return { data: null, error: "Only admins can log in here" };
      }

      // Save locally via IPC
      await window.electronAPI.adminLogin({
        id: data.user.id,
        email: data.user.email!,
        role: "admin",
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    set({ user: data.user, session: data.session, loading: false });
    return { data, error: null };
  },

  // SIGN UP
  // TODO: set up the sign up properly

  // Sign out
  signOut: async () => {
    await supabase.auth.signOut();
    await window.electronAPI.clearSession();
    set({ user: null, session: null });
  },
}));

// Listener for auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  const { user } = session ?? {};
  useAuthStore.setState({
    user: user ?? null,
    session: session ?? null,
    error: null,
    loading: false,
  });
});
