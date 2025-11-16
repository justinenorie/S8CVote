"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStores";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signInWithPassword, loading } = useAuthStore();

  // Form Schema
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await signInWithPassword(values.email, values.password);

    if (result.error) {
      toast.error(result.error, {
        description: "Please check your credentials and try again.",
      });
    } else {
      toast.success("Welcome Back!", {
        description: `Logged in as ${values.email}`,
      });
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-1 md:px-10">
      <div className="md:bg-card flex w-full overflow-hidden rounded-lg md:max-w-[1050px] md:border md:shadow-lg">
        {/* Left Side - Image */}
        <div className="hidden w-1/2 md:block">
          <Image
            src="/s8clogreg.jpg"
            alt="Login illustration"
            className="h-full w-full object-cover"
            width={150}
            height={150}
            priority={true}
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex w-full flex-col items-center justify-center p-2 sm:p-6 md:w-1/2 md:p-8">
          <div className="text-center">
            <Typography variant="h3" className="">
              Welcome back
            </Typography>
            <Typography variant="p" className="text-muted-foreground mb-6">
              Login to your S8CVote account
            </Typography>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                          <Mail className="h-5 w-5" />
                        </span>
                        <Input
                          {...field}
                          type="email"
                          placeholder="email@example.com"
                          className="px-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      <Typography variant="small">
                        <Link
                          href="/forgot-password"
                          className="text-SECONDARY-600 dark:text-SECONDARY-300 hover:text-foreground/80 dark:hover:text-foreground/80"
                        >
                          Forgot password?
                        </Link>
                      </Typography>
                    </div>

                    <FormControl>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                          <Lock className="h-5 w-5" />
                        </span>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="px-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                variant="default"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Signup Link */}
              <div className="grid w-full place-content-center justify-center">
                <Typography
                  variant="small"
                  className="text-muted-foreground text-center"
                >
                  Don’t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-SECONDARY-600 dark:text-SECONDARY-300 hover:text-foreground/80 dark:hover:text-foreground/80 font-bold"
                  >
                    Sign up
                  </Link>
                </Typography>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
