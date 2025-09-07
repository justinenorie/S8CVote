import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginResponse } from "../types/api";
import Typography from "@renderer/components/Typography";

type LoginProps = {
  onLogin: () => void;
};

const Login = ({ onLogin }: LoginProps): React.JSX.Element => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const res: LoginResponse = await window.api.login(adminUser, password);

      if (res.success && res.token) {
        localStorage.setItem("token", res.token);
        onLogin();
        navigate("/dashboard");
      } else {
        alert(res.message);
      }
    } catch {
      alert("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-BGdark flex h-screen items-center justify-center">
      <div className="bg-ERRORlight">
        <div className="border-ERRORlight h-10 w-full border-2">
          <Typography variant="h1" className="text-red-400">
            Hey
          </Typography>
        </div>

        <form
          onSubmit={handleLogin}
          className="w-96 rounded-2xl bg-white p-8 shadow-lg"
        >
          <Typography variant="small" className="text-TEXTdark">
            S8CVote Login
          </Typography>
          <h1 className="mb-6 text-center text-2xl font-bold">S8CVote Login</h1>

          <div className="mb-4">
            <label className="mb-1 block text-gray-600">Username</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-gray-600">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
