"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStores";
import { toast } from "sonner";
import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  const { verifyEmailOtp, resendEmailOtp, loading } = useAuthStore();

  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const handleVerify = async () => {
    const { error } = await verifyEmailOtp(email, otp);

    if (error) {
      toast.error("Invalid or expired code");
      return;
    }

    toast.success("Email verified! You may now log in.");
    router.push("/");
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    await resendEmailOtp(email);
    toast.info("A new verification code has been sent");

    setCooldown(60 * 3); // 3 minutes
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Typography variant="h2">Verify Your Email</Typography>

      <Typography variant="p" className="text-muted-foreground text-center">
        Enter the 6-digit code sent to <strong>{email}</strong>
      </Typography>

      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
        className="text-2xl"
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button
        disabled={loading || otp.length < 6}
        onClick={handleVerify}
        className="w-full max-w-xs"
      >
        Verify Email
      </Button>

      <Button
        variant="ghost"
        disabled={cooldown > 0}
        onClick={handleResend}
        className="text-sm"
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
      </Button>
    </div>
  );
}
