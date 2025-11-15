import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@renderer/stores/useAuthStore";
import { Button } from "@renderer/components/ui/Button";
import Typography from "@renderer/components/ui/Typography";
import { Input } from "@renderer/components/ui/input";
import { toast } from "sonner";
import { MoveLeft, Lock, Eye, EyeOff } from "lucide-react";

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
} from "@renderer/components/ui/form";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function ForgotPassChangePass() {
  const navigate = useNavigate();
  const { finishPasswordReset, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: any) => {
    const result = await finishPasswordReset(values.password);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Password has been updated!");
    navigate("/");
  };

  return (
    <div className="bg-background text-foreground flex h-screen items-center justify-center">
      <div className="flex max-w-sm flex-col items-center justify-center space-y-5">
        <div className="space-y-2 text-center">
          <Typography variant="h2">Set New Password</Typography>
          <Typography variant="small" className="text-foreground/80">
            <strong>Must be at least 8 characters long.</strong> This will help
            protect your account from unauthorized access.
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
              onClick={() => navigate("/")}
            >
              <MoveLeft size={16} /> Back to Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
