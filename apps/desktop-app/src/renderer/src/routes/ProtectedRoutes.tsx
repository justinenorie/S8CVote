import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@renderer/stores/useAuthStore";

const ProtectedRoutes = (): React.JSX.Element => {
  const { authStatus } = useAuthStore();

  // if (authStatus === "checking") {
  //   return <div className="p-6 text-center">Loading...</div>;
  // }

  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/" replace />;
  }

  if (authStatus === "pendingApproval") {
    return <Navigate to="/pending-approval" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
