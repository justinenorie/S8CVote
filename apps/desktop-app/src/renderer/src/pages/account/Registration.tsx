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
const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(1, "Full Name is Required"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegistrationPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const { signUpAdmin, loading } = useAuthStore();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    const result = await signUpAdmin(data.email, data.password, data.name);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Registration request submitted ✅", {
        description: "An existing admin must approve your account.",
      });
      navigate(`/verify-admin-otp?email=${data.email}`);
    }

    // if (result.error) {
    //   toast.error(result.error, {
    //     description: "Please check your credentials and try again.",
    //   });
    // } else {
    //   toast.success("Welcome Back!", {
    //     description: `Logged in as ${data.email}`,
    //   });
    //   navigate("/dashboard");
    // }
  };

  return (
    <section className="bg-BGlight dark:bg-BGdark flex h-screen items-center">
      <div className="grid w-full grid-cols-2 items-center">
        {/* LOGIN FORM */}
        <div className="border-TEXTdark text-TEXTdark dark:text-TEXTlight bg-PRIMARY-100 dark:bg-PRIMARY-800/40 grid w-full gap-5 rounded-2xl border p-8 py-20 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
              <Typography
                variant="h4"
                className="text-TEXTdark dark:text-TEXTlight block text-center font-semibold"
              >
                Sign up as Admin
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

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                          <UserRound className="h-5 w-5" />
                        </span>
                        <Input
                          {...field}
                          type="name"
                          placeholder="eg. Juan Dela Cruz"
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

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                          <Lock className="h-5 w-5" />
                        </span>
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          className="border-TEXTdark/20 w-full rounded-lg border px-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                        >
                          {showConfirmPassword ? (
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
                  {loading ? "Processing..." : "Register"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="grid w-full place-content-center justify-center">
            <Typography
              variant="small"
              className="text-muted-foreground text-center"
            >
              Already have an account?{" "}
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="h-0 cursor-pointer p-0"
              >
                <Typography
                  variant="small"
                  className="text-PRIMARY-900 dark:text-PRIMARY-200 hover:text-foreground/90"
                >
                  Login
                </Typography>
              </Button>
            </Typography>
          </div>
        </div>

        <div className="flex h-auto flex-col items-center">
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
      </div>
    </section>
  );
};

export default RegistrationPage;
