"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStores";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function VerifyResetOtp() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const router = useRouter();

  const { verifyResetOtp, loading } = useAuthStore();
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    const { error } = await verifyResetOtp(email, otp);
    if (error) return toast.error(error);

    toast.success("OTP verified! Set a new password");
    router.push("/reset-password");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
      <InputOTP
        value={otp}
        onChange={setOtp}
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot index={i} key={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button disabled={otp.length < 6 || loading} onClick={handleVerify}>
        Verify Code
      </Button>
    </div>
  );
}
