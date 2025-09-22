import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

type SignInResult =
  | { data: null; error: string }
  | { data: null; error: null }
  | { data: { user: User; session: Session }; error: null };

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;

  // Actions
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<SignInResult>;
  signUp: (email: string, password: string, profile: null) => Promise<void>;
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
    }

    set({ user: data.user, session: data.session, loading: false });
    return { data, error: null };
  },

  // SIGN UP
  // TODO: set up the sign up properly
  signUp: async (email, password, profile) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    if (data.user) {
      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        // @ts-ignore
        role: (profile?.role ?? "student") as "student" | "admin" | "faculty",
        // @ts-ignore
        fullname: profile?.fullname ?? null,
        // @ts-ignore
        student_id: profile?.student_id ?? null,
      });

      if (upsertError) {
        console.error("Profile upsert failed:", upsertError);
      }
    }

    set({ user: data.user, session: data.session, loading: false });
  },

  // SIGN OUT
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));

// Listener for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  const { user } = session ?? {};
  useAuthStore.setState({
    user: user ?? null,
    session: session ?? null,
    error: null,
    loading: false,
  });
});
