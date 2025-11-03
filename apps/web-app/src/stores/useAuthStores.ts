import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Profile } from "@/types/api";

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
  profile?: Profile | null;
  loading: boolean;
  error: string | null;

  // Actions
  verifyEmailOtp: (email: string, token: string) => Promise<SignInResult>;
  resendEmailOtp: (email: string) => Promise<SignInResult>;
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<SignInResult>;
  registerStudent: (
    student_id: string,
    email: string,
    password: string
  ) => Promise<SignInResult<void>>;
  verifyStudent: (
    student_id: string
  ) => Promise<SignInResult<{ fullname: string }>>;
  getCurrentUser: () => Promise<SignInResult<void>>;

  signOutStudent: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  // Verify Email using OTP
  verifyEmailOtp: async (email, token) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    set({ loading: false });
    const user = data.user;
    const fullname = localStorage.getItem("pending_fullname");
    const student_id = localStorage.getItem("pending_student_id");

    await supabase
      .from("profiles")
      .update({ fullname: fullname, student_id: student_id })
      .eq("id", user?.id);

    // Clear after verification
    localStorage.removeItem("pending_fullname");
    localStorage.removeItem("pending_student_id");

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  },

  // Resend Email OTP
  resendEmailOtp: async (email: string) => {
    set({ loading: true, error: null });
    console.log("Got Resended:", email);

    // TODO: Not working properly

    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email: `${email}`,
    });

    set({ loading: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  },

  // Login
  signInWithPassword: async (email, password) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!data?.user?.email_confirmed_at) {
      set({
        loading: false,
        error: "Please verify your email before logging in",
      });
      return { data: null, error: "Email not verified" };
    }

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

  // Registration
  registerStudent: async (student_id, email, password) => {
    set({ loading: true, error: null });

    // Step 1: Check if student exists
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("fullname, isRegistered")
      .eq("student_id", student_id)
      .single();

    if (studentError || !student) {
      set({ loading: false, error: "Student ID not found or not enrolled" });
      return { data: null, error: "Student ID not found or not enrolled" };
    }

    if (student.isRegistered === 1) {
      set({ loading: false, error: "Student ID already registered" });
      return { data: null, error: "Student ID already registered" };
    }

    // Step 2: Register in Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      set({
        loading: false,
        error: authError?.message || "Registration failed",
      });
      return { data: null, error: authError?.message || "Registration failed" };
    }

    await supabase
      .from("students")
      .update({
        isRegistered: 1,
        email,
      })
      .eq("student_id", student_id);

    // store temporarily after registration
    localStorage.setItem("pending_fullname", student.fullname);
    localStorage.setItem("pending_student_id", student_id);

    set({ loading: false });
    return { data: null, error: null };
  },

  // Verify Student ID
  verifyStudent: async (student_id) => {
    if (!student_id) return { data: null, error: "Please enter a student ID" };

    set({ loading: true, error: null });

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("fullname, isRegistered")
      .eq("student_id", student_id)
      .single();

    set({ loading: false });

    if (studentError || !student) {
      return { data: null, error: "Student ID not found or not enrolled..." };
    }

    if (student.isRegistered === 1) {
      return { data: null, error: "This student ID is already registered" };
    }

    return { data: { fullname: student.fullname }, error: null };
  },

  getCurrentUser: async () => {
    set({ loading: true, error: null });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      set({ user: null, session: null, profile: null, loading: false });
      return { data: null, error: "No user found" };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("fullname, student_id, role")
      .eq("id", user.id)
      .single();

    set({
      user,
      profile: profile ?? null,
      loading: false,
    });

    return {
      data: {
        user: null,
        session: null,
        profile: profile,
      },
      error: null,
    };
  },

  // Sign out
  signOutStudent: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
