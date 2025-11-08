"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStores";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Typography from "@/components/ui/Typography";
import { toast } from "sonner";
import { MoveLeft, Lock, Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ResetPasswordPage() {
  const { updatePassword, loading } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    const { error } = await updatePassword(values.password);
    if (error) return toast.error(error);

    toast.success("Password reset successful!");
    router.push("/");
  };

  return (
    <div className="flex max-w-sm flex-col items-center justify-center space-y-5">
      <div className="space-y-2 text-center">
        <Typography variant="h2">Set New Password</Typography>
        <Typography variant="small" className="text-muted-foreground">
          Must be at least 8 characters.
        </Typography>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                      <Lock className="h-5 w-5" />
                    </span>

                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
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

          {/* Submit */}
          <Button type="submit" disabled={loading}>
            Reset Password
          </Button>

          {/* Back */}
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-1"
            onClick={() => router.push("/")}
          >
            <MoveLeft size={16} /> Back to Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
