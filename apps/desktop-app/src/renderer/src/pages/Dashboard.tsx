import { useNavigate } from "react-router-dom";

const Dashboard = (): React.JSX.Element => {
  const navigate = useNavigate();

  const logout = (): void => {
    localStorage.setItem("isAuthenticated", "false");
    navigate("/", { replace: true });
  };

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-500">Overview of the student voting system</p>
      {/* Cards, charts, etc */}
      <button
        onClick={logout}
        className="mt-6 rounded bg-red-500 px-4 py-2 text-white"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
