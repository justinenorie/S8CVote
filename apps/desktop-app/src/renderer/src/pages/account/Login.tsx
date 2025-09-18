import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginResponse } from "../../types/api";
import Typography from "@renderer/components/ui/Typography";
import s8cvotelogo from "../../assets/S8CVote-TempLogo.png";
import { UserRound, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@renderer/components/ui/Button";
import { Input } from "@renderer/components/ui/input";

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

      // TODO: Find a way to have safer way to save the accessTokens
      if (res.success && res.token) {
        localStorage.setItem("token", res.token);
        onLogin();
        navigate("/dashboard");
      } else {
        // TODO: Need a better alert
        alert(res.message);
      }
    } catch {
      alert("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-BGlight dark:bg-BGdark flex h-screen items-center justify-center">
      <div className="grid w-full grid-cols-2 items-center">
        <div className="h-auto">
          <img src={s8cvotelogo} alt="s8cvotelogo" className="h-20 w-20" />

          <Typography
            variant="h3"
            className="text-TEXTdark dark:text-TEXTlight font-semibold"
          >
            Welcome to S8CVote
          </Typography>

          <Typography variant="p" className="text-TEXTdark dark:text-TEXTlight">
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

          <div className="mb-4 grid gap-3">
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                <UserRound className="h-5 w-5" />
              </span>
              <Input
                type="text"
                className="border-TEXTdark/20 w-full rounded-lg border px-10"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                <Lock className="h-5 w-5" />
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                className="border-TEXTdark/20 w-full rounded-lg border px-10"
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
                  <EyeOff className="h-6 w-6" />
                ) : (
                  <Eye className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* TODO: Make a component for this to reuse it in another ui */}
          <div className="grid gap-2">
            <Button type="submit" disabled={loading} variant="default">
              {loading ? "Logging in..." : "Login"}
            </Button>

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
