"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

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

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  // Form Schema
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    console.log("Form Data:", values);
    // TODO: Supabase submit value here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-BGlight dark:bg-BGdark">
      <div className="flex w-[900px] overflow-hidden rounded-lg border bg-card shadow-lg">
        {/* Left Side - Image */}
        <div className="hidden w-1/2 md:block">
          <Image
            // TODO: Change the image later on
            src="/s8clogreg.jpg"
            alt="Login illustration"
            className="h-full w-full object-cover"
            width={150}
            height={150}
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2">
          <Typography variant="h2" className="mb-2">
            Welcome back
          </Typography>
          <Typography variant="p" className="mb-6 text-muted-foreground">
            Login to your S8CVote account
          </Typography>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2 text-sm text-muted-foreground"
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forgot Password */}
              <div className="flex justify-end text-sm">
                <a
                  href="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full">
                Login
              </Button>

              {/* Signup Link */}
              <p className="text-center text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <a href="/register" className="text-primary hover:underline">
                  Sign up
                </a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
