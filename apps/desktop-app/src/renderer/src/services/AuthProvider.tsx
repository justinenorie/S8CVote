import { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuthStore, AuthState } from "@renderer/stores/useAuthStore";

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const {
    user,
    session,
    loading,
    error,
    signInWithPassword,
    signOut,
    loadAdminData,
  } = useAuthStore();

  // Load admin from SQLite on startup
  useEffect(() => {
    loadAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthState = {
    user,
    session,
    adminData: null,
    loading,
    error,
    signInWithPassword,
    signOut,
    loadAdminData,
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
