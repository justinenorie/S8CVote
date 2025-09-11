import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Layout = lazy(() => import("@renderer/components/sections/Layout"));
const Login = lazy(() => import("@renderer/pages/account/Login"));
const Dashboard = lazy(() => import("@renderer/pages/Dashboard"));
const Elections = lazy(() => import("@renderer/pages/Elections"));
const Candidates = lazy(() => import("@renderer/pages/Candidates"));
const NotFound = lazy(() => import("@renderer/pages/NotFound"));
const ProtectedRoutes = lazy(() => import("./ProtectedRoutes"));

const AppRoutes = ({
  isAuthenticated,
  setIsAuthenticated,
}: {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}): React.JSX.Element => {
  return (
    <Routes>
      {/* Public routes (no layout) */}
      <Route
        path="/"
        element={<Login onLogin={() => setIsAuthenticated(true)} />}
      />

      {/* Protected routes (with layout) */}
      <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* If user isn’t logged in and hits random route */}
      {!isAuthenticated && (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};

export default AppRoutes;
