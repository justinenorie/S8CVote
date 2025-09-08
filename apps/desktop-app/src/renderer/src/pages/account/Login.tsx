import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginResponse } from "../../types/api";
import Typography from "@renderer/components/Typography";
import s8cvotelogo from "../../assets/S8CVote-TempLogo.png";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

type LoginProps = {
  onLogin: () => void;
};

const Login = ({ onLogin }: LoginProps): React.JSX.Element => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <section className="bg-BGlight flex h-screen items-center justify-center">
      <div className="grid w-full grid-cols-2 items-center">
        <div className="h-auto">
          <img src={s8cvotelogo} alt="s8cvotelogo" className="h-20 w-20" />

          <Typography variant="h3" className="text-TEXTdark font-semibold">
            Welcome to S8CVote
          </Typography>

          <Typography variant="p" className="">
            Manage school elections simple and transparent with S8CVote.
          </Typography>
        </div>

        <form
          onSubmit={handleLogin}
          className="border-TEXTdark bg-BGlight grid w-full gap-5 rounded-2xl border-1 p-8 py-20 shadow-lg"
        >
          <Typography
            variant="h4"
            className="text-TEXTdark block text-center font-semibold"
          >
            Sign in to Admin Panel
          </Typography>

          <div className="mb-4">
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                <FaUser className="h-5 w-5" />
              </span>
              <input
                type="text"
                className="w-full rounded-lg border px-10 py-2 focus:ring focus:ring-blue-300"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                <FaLock className="h-5 w-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border px-10 py-2 focus:ring focus:ring-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="h-6 w-6" />
                ) : (
                  <AiFillEye className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* TODO: Make a component for this to reuse it in another ui */}
          <div className="grid gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="block text-center">
              <Typography variant="small" className="">
                Forgot password?{" "}
              </Typography>

              {/* TODO: Use the LINK from react-router instead of anchor */}
              <a href="#" className="underline">
                <Typography variant="small" className="text-PRIMARY-900">
                  Click here
                </Typography>
              </a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
