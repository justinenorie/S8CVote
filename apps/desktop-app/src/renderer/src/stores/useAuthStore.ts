import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { Admin } from "@renderer/types/api";

export type AuthStatus =
  | "checking"
  | "unauthenticated"
  | "pendingApproval"
  | "authorized";

export type SignInResult<T = void> =
  | { data: null; error: string }
  | { data: T; error: null }
  | { data: null; error: null }
  | {
      data: { user: User | null; session?: Session | null; adminData?: Admin };
      error: null;
    };

// For Validations
export interface AuthState {
  user: User | null;
  session: Session | null;
  adminData: Admin | null;
  loading: boolean;
  authStatus: AuthStatus;
  error: string | null;

  // Actions
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<SignInResult>;
  signUpAdmin: (
    email: string,
    password: string,
    fullname: string
  ) => Promise<SignInResult>;
  verifyEmailOtp: (email: string, token: string) => Promise<SignInResult>;
  resendEmailOtp: (email: string) => Promise<SignInResult>;
  loadAdminData: () => Promise<SignInResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<SignInResult>;
  verifyResetOtp: (email: string, token: string) => Promise<SignInResult>;
  finishPasswordReset: (newPassword: string) => Promise<SignInResult<void>>;
}

// For Updating Data
interface UpdateInfoState {
  loading: boolean;
  error: string | null;

  updateAccountDetails: (
    fullname: string,
    email: string
  ) => Promise<SignInResult>;
  verifyEmailChangeOtp: (
    newEmail: string,
    code: string
  ) => Promise<SignInResult>;
  resendEmailChangeOtp: (newEmail: string) => Promise<SignInResult>;
  updatePassword: (
    newPassword: string,
    currentPassword: string
  ) => Promise<SignInResult>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  adminData: null,
  loading: false,
  authStatus: "checking",
  error: null,

  // SIGN IN WITH PASSWORD
  signInWithPassword: async (email, password) => {
    set({ loading: true, authStatus: "checking", error: null });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({
        loading: false,
        authStatus: "unauthenticated",
        error: error?.message ?? "Login failed",
      });
      return { data: null, error: error.message };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, fullname, is_approved")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      set({
        loading: false,
        authStatus: "unauthenticated",
        error: "Profile not found",
      });
      return { data: null, error: "Profile not found" };
    }

    // check if admin
    if (profile.role !== "admin") {
      await get().signOut();
      set({
        loading: false,
        authStatus: "unauthenticated",
        error: "Only admins can log in here",
      });
      return { data: null, error: "Only admins can log in here" };
    }

    // check if approved admin
    if (!profile.is_approved) {
      await get().signOut();
      set({
        loading: false,
        authStatus: "pendingApproval",
        error: "Your admin account is pending approval.",
      });
      return { data: null, error: "Your admin account is pending approval." };
    }

    // Save locally via IPC
    const adminOfflineData = {
      id: data.user.id,
      email: data.user.email!,
      fullname: profile.fullname,
      role: "admin",
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await window.electronAPI.adminLogin(adminOfflineData);

    set({
      adminData: adminOfflineData,
      user: data.user,
      session: data.session,
      loading: false,
      authStatus: "authorized",
    });
    return {
      data: {
        user: data.user,
        session: data.session,
        adminData: adminOfflineData,
      },
      error: null,
    };
  },

  // LOAD ADMIN
  loadAdminData: async (): Promise<SignInResult<void>> => {
    set({ loading: true, authStatus: "checking" });

    try {
      const localUser = (await window.electronAPI.getAdminUser()) as
        | Admin
        | undefined;

      if (!localUser) {
        set({
          user: null,
          session: null,
          adminData: null,
          loading: false,
          authStatus: "unauthenticated",
        });
        return { data: null, error: null };
      }

      // 2. Check Supabase session (do NOT restore via setSession)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 3. If session exists → authenticated
      if (session) {
        set({
          adminData: localUser,
          user: session.user,
          session,
          loading: false,
          authStatus: "authorized",
        });
        return { data: null, error: null };
      }

      // 4. No valid session → NOT authenticated
      // But still load adminData for offline display
      set({
        adminData: localUser,
        user: null,
        session: null,
        loading: false,
        authStatus: "unauthenticated",
      });

      return { data: null, error: null };
    } catch (error) {
      console.error("loadAdminData error:", error);
      set({
        user: null,
        session: null,
        adminData: null,
        loading: false,
        authStatus: "unauthenticated",
      });
      return { data: null, error: "Failed to load admin data" };
    }
  },

  // SIGN UP
  signUpAdmin: async (email, password, fullname) => {
    set({ loading: true, error: null });

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role_type: "admin",
          fullname,
        },
      },
    });

    if (signUpError || !data.user) {
      set({ loading: false, error: signUpError?.message ?? "Sign up failed" });
      return { data: null, error: signUpError?.message ?? "" };
    }

    set({ loading: false });
    return { data: null, error: null };
  },

  // VERIFY EMAIL OTP
  verifyEmailOtp: async (email, token) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    set({ loading: false });

    if (error) return { data: null, error: error.message };

    // Retrieve fullname stored before verification
    const fullname = localStorage.getItem("pending_admin_fullname");
    localStorage.removeItem("pending_admin_fullname");

    // Insert into profiles as pending admin
    await supabase.from("profiles").insert({
      id: data.user?.id,
      fullname,
      role: "admin",
      is_approved: false,
    });

    return { data, error: null };
  },

  // RESEND OTP
  resendEmailOtp: async (email) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  },

  // Sign out
  signOut: async () => {
    set({ loading: true });

    await supabase.auth.signOut();
    await window.electronAPI.clearSession();
    set({
      user: null,
      session: null,
      adminData: null,
      loading: false,
      authStatus: "unauthenticated",
    });
  },

  // ==================================================================================

  // FORGOT PASSWORD STORE

  requestPasswordReset: async (email) => {
    set({ loading: true, error: null });

    // 1. Verify IF admin exists in profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_approved")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      set({ loading: false, error: "Email not found." });
      return { data: null, error: "Email not found." };
    }

    if (profile.role !== "admin") {
      set({ loading: false, error: "Only admins can reset password." });
      return { data: null, error: "Only admins can reset password." };
    }

    if (!profile.is_approved) {
      set({ loading: false, error: "Admin is not yet approved." });
      return { data: null, error: "Admin is not yet approved." };
    }

    // 2. Send RESET OTP
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    set({ loading: false });

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  },

  verifyResetOtp: async (email, token) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });

    set({ loading: false });

    if (error) return { data: null, error: error.message };

    // User is now logged in TEMPORARILY
    useAuthStore.setState({
      user: data.user,
      session: data.session,
      authStatus: "authorized",
    });

    return { data, error: null };
  },

  finishPasswordReset: async (newPassword) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    set({ loading: false });

    if (error) return { data: null, error: error.message ?? "" };

    return { data, error: null };
  },
}));

/**
 * supabase.auth.onAuthStateChange((_event, session) => {
  const { user } = session ?? {};
  useAuthStore.setState({
    user: user ?? null,
    session: session ?? null,
    error: null,
    loading: false,
  });
});
 */

// Listener for auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  const state = useAuthStore.getState();

  // ✅ DO NOT allow this to auto-authorize a user.
  // Only update tokens if already authorized.
  if (
    state.authStatus === "authorized" ||
    state.authStatus === "pendingApproval"
  ) {
    useAuthStore.setState({
      user: session?.user ?? null,
      session: session ?? null,
    });
  }
});

// ==================================================================================

// For Updating Data
export const useUpdateAuthStore = create<UpdateInfoState>((set) => ({
  loading: false,
  error: null,

  // ADMIN UPDATE
  updateAccountDetails: async (fullname, newEmail) => {
    set({ loading: true, error: null });

    try {
      // get current session
      const state = useAuthStore.getState();
      const currentEmail = state.user?.email;

      //  Update fullname immediately
      if (fullname && fullname !== state.adminData?.fullname) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ fullname })
          .eq("id", state.user?.id);

        if (profileError) {
          set({ loading: false, error: profileError.message });
          return { data: null, error: profileError.message };
        }
      }

      // If email is unchanged, no OTP needed
      if (newEmail === currentEmail) {
        set({ loading: false });
        return { data: null, error: null };
      }

      // 1) Request email change (sets pending email)
      const { error: requestError } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (requestError) {
        set({ loading: false, error: requestError.message });
        return { data: null, error: requestError.message };
      }

      // 2) Send OTP to NEW email
      // Send OTP to NEW email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: newEmail,
        options: { shouldCreateUser: false },
      });
      if (otpError) {
        set({ loading: false, error: otpError.message });
        return { data: null, error: otpError.message };
      }

      // ✅ Don't update SQLite yet — wait for confirmation
      // We will update local admin data after email is confirmed
      // (session change event listener will handle it)

      set({ loading: false });
      return { data: null, error: null };
    } catch (error: unknown) {
      set({ error: error as string, loading: false });
      return { data: null, error: "Unexpected error" };
    }
  },

  // VERIFY EMAIL OTP
  verifyEmailChangeOtp: async (newEmail, code) => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.auth.verifyOtp({
      type: "email_change",
      token: code,
      email: newEmail,
    });

    if (error) {
      set({ loading: false, error: error.message });
      return { data: null, error: error.message };
    }

    //  Now safely apply the email change
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (updateError) return { data: null, error: updateError.message };

    // ✅ Update Local SQLite After Supabase Confirmed
    const state = useAuthStore.getState();
    const updatedAdmin = {
      ...state.adminData!,
      email: newEmail,
      updated_at: new Date().toISOString(),
    };

    // TODO: update the admin user in sqlite
    // await window.electronAPI.updateAdminUser(updatedAdmin);
    useAuthStore.setState({ adminData: updatedAdmin });

    set({ loading: false });
    return { data, error: null };
  },

  // RESEND OTP
  resendEmailChangeOtp: async (newEmail) => {
    const { error } = await supabase.auth.resend({
      type: "email_change",
      email: newEmail,
    });

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  },

  // Update Password
  updatePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });

    const state = useAuthStore.getState();
    const currentEmail = state.user?.email;
    if (!currentEmail) {
      set({ loading: false, error: "No logged-in user" });
      return { data: null, error: "No logged-in user" };
    }

    // 1. Re-authenticate to verify old password
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password: currentPassword,
    });

    if (reauthError) {
      set({ loading: false, error: "Incorrect current password" });
      return { data: null, error: "Incorrect current password" };
    }

    // 2. Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      set({ loading: false, error: updateError.message });
      return { data: null, error: updateError.message };
    }

    set({ loading: false });
    return { data: null, error: null };
  },
}));
