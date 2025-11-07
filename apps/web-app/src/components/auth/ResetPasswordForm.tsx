"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStores";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const { updatePassword, loading } = useAuthStore();
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    const { error } = await updatePassword(password);
    if (error) return toast.error(error);

    toast.success("Password reset successful!");
    router.push("/");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
      <Input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="max-w-sm"
      />

      <Button
        disabled={!password || loading}
        onClick={handleReset}
        className="w-full max-w-sm"
      >
        Update Password
      </Button>
    </div>
  );
}
