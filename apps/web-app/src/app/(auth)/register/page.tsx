"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { UserRound, Lock, Eye, EyeOff, Mail, IdCard } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z.string().min(1, "Enter your full name"),
  student_id: z.string().min(1, "Enter your Student ID"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Form Schema
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      student_id: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    console.log("Form Data:", values);
    // TODO: Supabase submit value here
    router.push("/dashboard");
  };

  return (
    <div className="bg-BGlight dark:bg-BGdark flex min-h-screen items-center justify-center px-5 sm:px-10">
      <div className="bg-card flex w-full max-w-[1050px] overflow-hidden rounded-lg border shadow-lg">
        {/* Left Side*/}
        <div className="bg-card flex w-full flex-col items-center justify-center p-8 md:w-1/2">
          <div>
            <Typography variant="h2" className="">
              Create an account
            </Typography>
            <Typography variant="p" className="text-muted-foreground mb-6">
              Sign up now to get started with S8CVote
            </Typography>
          </div>

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

              {/* Full Name */}
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
                          placeholder="eg. Juan D. Dela Cruz"
                          className="px-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Student ID */}
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                          <IdCard className="h-5 w-5" />
                        </span>
                        <Input
                          {...field}
                          type="name"
                          placeholder="eg. 20-0001"
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
                    <FormLabel>Password</FormLabel>
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

              <Button type="submit" className="w-full">
                Create an account
              </Button>

              {/* Signup Link */}
              <div className="grid w-full place-content-center justify-center">
                <Typography
                  variant="small"
                  className="text-muted-foreground text-center"
                >
                  Already have an account?{" "}
                  <Link href="/" className="text-primary hover:underline">
                    Log in
                  </Link>
                </Typography>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Side */}
        <div className="hidden w-1/2 md:block">
          <Image
            // TODO: Change the image later on
            src="/s8clogreg.jpg"
            alt="Login illustration"
            className="h-full w-full object-cover"
            width={150}
            height={150}
            priority={true}
          />
        </div>
      </div>
    </div>
  );
}
