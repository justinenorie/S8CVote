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
import { MoveLeft } from "lucide-react";

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
    <div className="flex max-w-sm flex-col items-center justify-center space-y-5">
      <div className="space-y-2 text-center">
        <Typography variant="h2">Verify Your Email</Typography>
        <Typography
          variant="small"
          className="text-muted-foreground text-center"
        >
          Enter the 6-digit code sent to <strong>{email}</strong>
        </Typography>
      </div>

      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot className="h-15 w-15" index={i} key={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div className="flex w-full flex-col gap-5">
        <Button
          disabled={loading || otp.length < 6}
          onClick={handleVerify}
          className="cursor-pointer"
        >
          Verify Code
        </Button>

        <div className="flex flex-row items-center justify-center">
          <Typography variant="small">
            {"Didn't receive a OTP code?"}
          </Typography>
          <Button
            variant="link"
            disabled={cooldown > 0}
            onClick={handleResend}
            className="cursor-pointer text-sm"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Click to resend"}
          </Button>
        </div>

        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="flex cursor-pointer items-center"
        >
          <MoveLeft />
          Back to Login
        </Button>
      </div>
    </div>
  );
}
