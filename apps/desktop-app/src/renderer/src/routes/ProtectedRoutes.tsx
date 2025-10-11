import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@renderer/services/AuthProvider";

const ProtectedRoutes = (): React.JSX.Element => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
