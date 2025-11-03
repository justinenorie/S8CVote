import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { Admin } from "@renderer/types/api";

export type SignInResult<T = void> =
  | { data: null; error: string }
  | { data: T; error: null }
  | { data: null; error: null }
  | {
      data: { user: User | null; session: Session | null; adminData?: Admin };
      error: null;
    };

// For Validations
export interface AuthState {
  user: User | null;
  session: Session | null;
  adminData: Admin | null;
  loading: boolean;
  error: string | null;

  // Actions
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<SignInResult>;
  loadAdminData: () => Promise<SignInResult>;
  signOut: () => Promise<void>;
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  adminData: null,
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

    if (profile.role !== "admin") {
      await supabase.auth.signOut();
      set({ user: null, session: null, loading: false });
      return { data: null, error: "Only admins can log in here" };
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

  loadAdminData: async (): Promise<SignInResult<void>> => {
    const localUser = await window.electronAPI.getAdminUser();
    set({ adminData: localUser as Admin | undefined, loading: false });
    return {
      data: {
        user: null,
        session: null,
        adminData: localUser as Admin | undefined,
      },
      error: null,
    };
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
