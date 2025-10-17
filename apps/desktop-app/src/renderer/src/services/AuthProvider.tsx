import { createContext, useContext, ReactNode } from "react";
import { useAuthStore, AuthState } from "@renderer/stores/useAuthStore";

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const { user, session, loading, error, signInWithPassword, signOut } =
    useAuthStore();

  const value: AuthState = {
    user,
    session,
    adminData: null,
    loading,
    error,
    signInWithPassword,
    loadAdminData: () => Promise.resolve({ data: null, error: null }),
    signOut,
  };

  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
