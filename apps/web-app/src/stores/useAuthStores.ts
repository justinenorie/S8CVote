import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
// import { StudentCredentials } from "@/types/api";

type SignInResult<T = void> =
  | { data: null; error: string }
  | { data: T; error: null }
  | { data: null; error: null }
  | {
      data: { user: User | null; session: Session | null };
      error: null;
    };

interface AuthState {
  user: User | null;
  session: Session | null;
  // adminData: Admin | null;
  loading: boolean;
  error: string | null;

  // Actions
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<SignInResult>;
  // registration
  // loadAdminData: () => Promise<SignInResult>;
  // signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  adminData: null,
  loading: false,
  error: null,

  signInWithPassword: async (email, password) => {
    set({ loading: true, error: null });

    // Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ error: error.message, loading: false });
      return { data: null, error: error.message };
    }

    if (!data.user) {
      set({ error: "No user found", loading: false });
      return { data: null, error: "No user found" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, fullname")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      set({ error: "Profile not found", loading: false });
      return { data: null, error: "Profile not found" };
    }

    if (profile.role !== "student") {
      await supabase.auth.signOut();
      set({ user: null, session: null, loading: false });
      return { data: null, error: "Only students can log in here" };
    }

    set({
      user: data.user,
      session: data.session,
      loading: false,
    });
    return {
      data: {
        user: data.user,
        session: data.session,
      },
      error: null,
    };
  },

  // Registration Here
}));
