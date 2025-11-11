import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@renderer/stores/useAuthStore";

const Layout = lazy(() => import("@renderer/components/sections/Layout"));
const Login = lazy(() => import("@renderer/pages/account/Login"));
const RegistrationPage = lazy(
  () => import("@renderer/pages/account/Registration")
);
const VerifyAdminOtpPage = lazy(
  () => import("@renderer/pages/account/VerifyAdminOtpPage")
);
const PendingApproval = lazy(
  () => import("@renderer/pages/account/PendingApproval")
);
const Dashboard = lazy(() => import("@renderer/pages/main/Dashboard"));
const Elections = lazy(() => import("@renderer/pages/main/Elections"));
const Partylist = lazy(() => import("@renderer/pages/main/Partylist"));
const Candidates = lazy(() => import("@renderer/pages/main/Candidates"));
const Students = lazy(() => import("@renderer/pages/main/Students"));
const Reports = lazy(() => import("@renderer/pages/main/Reports"));
const Settings = lazy(() => import("@renderer/pages/main/Settings"));
const NotFound = lazy(() => import("@renderer/pages/NotFound"));
const ProtectedRoutes = lazy(() => import("./ProtectedRoutes"));

const AppRoutes = (): React.JSX.Element => {
  const { authStatus } = useAuthStore();

  return (
    <Routes>
      {/* Public routes (no layout) */}
      <Route
        path="/"
        element={
          authStatus === "authorized" ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route path="/register" element={<RegistrationPage />}></Route>
      <Route path="/pending-approval" element={<PendingApproval />}></Route>
      <Route path="/verify-admin-otp" element={<VerifyAdminOtpPage />}></Route>

      {/* Protected routes (with layout) */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/partylist" element={<Partylist />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/students" element={<Students />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
