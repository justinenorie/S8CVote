"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStores";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MoveLeft } from "lucide-react";

export default function ForgotPassword() {
  const { requestPasswordReset, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSend = async () => {
    const { error } = await requestPasswordReset(email);
    if (error) return toast.error(error);

    toast.success("A reset code was sent to your email.");
    router.push(`/verify-reset-otp?email=${email}`);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 p-4">
      <div className="flex max-w-sm flex-col items-center justify-center space-y-5">
        <div className="space-y-2 text-left">
          <Typography variant="h2">Forgot Password?</Typography>
          <Typography variant="p">
            No worries! We will send an instructions to reset your password.
          </Typography>
        </div>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />

        <div className="flex w-full flex-col gap-5">
          <Button onClick={handleSend} disabled={loading} className="">
            Reset Password
          </Button>

          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="flex items-center"
          >
            <MoveLeft />
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
