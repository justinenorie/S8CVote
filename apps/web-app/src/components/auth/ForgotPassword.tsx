"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStores";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
      <div className="space-y-5 border-red-300">
        <Typography variant="h2">Forgot Password</Typography>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex w-full flex-row justify-between border-2 border-red-400">
          <Button onClick={() => router.back()} className="">
            Go Back
          </Button>

          <Button onClick={handleSend} disabled={loading} className="">
            Send Reset Code
          </Button>
        </div>
      </div>
    </div>
  );
}
