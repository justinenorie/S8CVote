import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Typography from "@renderer/components/ui/Typography";
import s8cvotelogo from "../../assets/S8CVote-TempLogo.png";
import { UserRound, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@renderer/components/ui/Button";
import { Input } from "@renderer/components/ui/input";
import { useAuthStore } from "@renderer/stores/useAuthStore";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form";

// Schema for Validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  // TODO: change the password requirements
  // this is for testing only change this later
  password: z
    .string()
    .min(4, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithPassword, loading } = useAuthStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    const result = await signInWithPassword(data.email, data.password);

    if (result.error) {
      toast.error(result.error, {
        description: "Please check your credentials and try again.",
      });
    } else {
      toast.success("Welcome Back!", {
        description: `Logged in as ${data.email}`,
      });
      navigate("/dashboard");
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

        {/* LOGIN FORM */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="border-TEXTdark bg-BGlight grid w-full gap-5 rounded-2xl border-1 p-8 py-20 shadow-lg"
          >
            <Typography
              variant="h4"
              className="text-TEXTdark block text-center font-semibold"
            >
              Sign in to Admin Panel
            </Typography>

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                        <UserRound className="h-5 w-5" />
                      </span>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                        className="border-TEXTdark/20 w-full rounded-lg border px-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                        <Lock className="h-5 w-5" />
                      </span>
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="border-TEXTdark/20 w-full rounded-lg border px-10"
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <Button type="submit" disabled={loading} variant="default">
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="block text-center">
                <Typography variant="small" className="">
                  Forgot password?{" "}
                </Typography>
                <a href="#" className="underline">
                  <Typography variant="small" className="text-PRIMARY-900">
                    Click here
                  </Typography>
                </a>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default Login;
