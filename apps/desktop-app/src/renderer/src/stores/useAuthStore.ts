import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient"; // make sure you have this client in lib
import { Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;

  // Actions
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profile) => Promise<void>;
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
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
      });
    }

    set({ user: data.user, session: data.session, loading: false });
  },

  // SIGN UP
  signUp: async (email, password, profile) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        fullname: profile?.fullname ?? null,
      });
    }

    set({ user: data.user, session: data.session, loading: false });
  },

  // SIGN OUT
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));

// 🔑 Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  const { user } = session ?? {};
  useAuthStore.setState({
    user: user ?? null,
    session: session ?? null,
    error: null,
    loading: false,
  });
});
