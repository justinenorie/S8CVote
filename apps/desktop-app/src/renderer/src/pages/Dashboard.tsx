import { Link, useNavigate } from "react-router-dom";

const Dashboard = (): React.JSX.Element => {
  const navigate = useNavigate();

  const logout = (): void => {
    localStorage.setItem("isAuthenticated", "false");
    navigate("/", { replace: true });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <nav className="space-x-4">
        <Link to="/elections" className="text-blue-500 underline">
          Elections
        </Link>
        <Link to="/candidates" className="text-blue-500 underline">
          Candidates
        </Link>
        <button onClick={logout} className="text-blue-500 underline">
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
