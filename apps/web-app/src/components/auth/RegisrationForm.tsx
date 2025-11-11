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
import { UserRound, Lock, Eye, EyeOff, Mail, IdCard } from "lucide-react";

const registerSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    name: z.string(),
    student_id: z.string().min(1, "Enter your Student ID"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { registerStudent, verifyStudent, loading, error } = useAuthStore();

  // Form Schema
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      student_id: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleVerifyStudent = async (student_id: string) => {
    const { error } = await verifyStudent(student_id);

    if (error) {
      setVerified(false);
      form.setError("student_id", { type: "manual", message: error });
      // form.setValue("name", error as string);
      return;
    }

    form.clearErrors("student_id");
    setVerified(true);
    // TODO: Replace this as another layer of verification if they're full name is correct, valid or not
    // form.setValue("name", (data as { fullname: string }).fullname);
    toast.success("Student verified!");
  };

  const onSubmit = async (values: RegisterFormValues) => {
    const { error } = await registerStudent(
      values.student_id,
      values.email,
      values.password
    );

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Account created! Please verify your email.");
    router.push(`/verify-otp?email=${values.email}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-1 py-15 md:px-10">
      <div className="md:bg-card flex w-full overflow-hidden rounded-lg md:max-w-[1050px] md:border md:shadow-lg">
        {/* Left Side*/}
        <div className="flex w-full flex-col items-center justify-center p-2 sm:p-6 md:w-1/2 md:p-8">
          <div className="text-center">
            <Typography variant="h3" className="">
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
                    <FormLabel>
                      <div className="flex flex-col gap-1">
                        Full Name{" "}
                        {/* <Typography
                        variant="small"
                        className="text-TEXTdark/50 dark:text-TEXTlight/50 text-xs"
                      >
                        {
                          "(Input your Student ID to automatically fill out your name)"
                        }
                      </Typography> */}
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                          <UserRound className="h-5 w-5" />
                        </span>
                        <Input
                          {...field}
                          type="name"
                          placeholder="eg. Juan Dela Cruz"
                          className="px-10"
                          // disabled
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
                    <FormLabel className="flex flex-row items-center justify-between">
                      Student ID{" "}
                      {verified && !form.formState.errors.student_id && (
                        <Typography
                          variant="p"
                          className="mt-1 text-sm text-green-600"
                        >
                          Verified
                        </Typography>
                      )}
                    </FormLabel>

                    <FormControl>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                          <IdCard className="h-5 w-5" />
                        </span>
                        <Input
                          {...field}
                          type="name"
                          placeholder="eg. 20-0001"
                          className={`border-2 px-10 ${
                            verified
                              ? "border-green-500 focus:border-green-600"
                              : form.formState.errors.student_id
                                ? "border-red-500 focus:border-red-600"
                                : ""
                          }`}
                          onBlur={(e) => handleVerifyStudent(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage></FormMessage>
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
                          type={showConfirm ? "text" : "password"}
                          placeholder="Re-enter password"
                          className="px-10"
                          {...field}
                        />

                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                        >
                          {showConfirm ? (
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

              {error && (
                <Typography
                  variant="small"
                  className="text-center text-red-500"
                >
                  {error}
                </Typography>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create an account"}
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
