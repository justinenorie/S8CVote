import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Layout = lazy(() => import("@renderer/components/sections/Layout"));
const Login = lazy(() => import("@renderer/pages/account/Login"));
const Dashboard = lazy(() => import("@renderer/pages/main/Dashboard"));
const Elections = lazy(() => import("@renderer/pages/main/Elections"));
const Candidates = lazy(() => import("@renderer/pages/main/Candidates"));
const Students = lazy(() => import("@renderer/pages/main/Students"));
const Reports = lazy(() => import("@renderer/pages/main/Reports"));
const Settings = lazy(() => import("@renderer/pages/main/Settings"));
const NotFound = lazy(() => import("@renderer/pages/NotFound"));
const ProtectedRoutes = lazy(() => import("./ProtectedRoutes"));

const AppRoutes = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}): React.JSX.Element => {
  return (
    <Routes>
      {/* Public routes (no layout) */}
      <Route path="/" element={<Login />} />

      {/* Protected routes (with layout) */}
      <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/students" element={<Students />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
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
