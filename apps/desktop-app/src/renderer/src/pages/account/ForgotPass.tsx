// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@renderer/stores/useAuthStore";
import { Button } from "@renderer/components/ui/Button";
import Typography from "@renderer/components/ui/Typography";
import { Input } from "@renderer/components/ui/input";
import { MoveLeft } from "lucide-react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export default function ForgotPass() {
  const navigate = useNavigate();
  const { requestPasswordReset, loading } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: { email: string }) => {
    const result = await requestPasswordReset(values.email);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("OTP sent! Check your email.");
    navigate(`/forgot-otp?email=${values.email}`);
  };

  return (
    <div className="bg-background text-foreground flex h-screen items-center justify-center">
      <div className="flex max-w-sm flex-col items-center justify-center space-y-5">
        <div className="space-y-2 text-center">
          <Typography variant="h2">Forgot Password?</Typography>
          <Typography variant="p">
            No worries! We will send an instructions to reset your password.
          </Typography>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          {form.formState.errors.email && (
            <Typography variant="small" className="text-red-500">
              {form.formState.errors.email.message}
            </Typography>
          )}
          <Input
            placeholder="Enter your email"
            {...form.register("email")}
            className="border-border border"
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending OTP..." : "Reset Password"}
          </Button>
        </form>

        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="flex w-full cursor-pointer items-center justify-center gap-2"
        >
          <MoveLeft /> Back to Login
        </Button>
      </div>
    </div>
  );
}
