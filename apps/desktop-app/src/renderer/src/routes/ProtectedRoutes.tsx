import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}): React.JSX.Element => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
