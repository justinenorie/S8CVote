import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@renderer/stores/useAuthStore";
import { Button } from "@renderer/components/ui/Button";
import Typography from "@renderer/components/ui/Typography";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@renderer/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { MoveLeft } from "lucide-react";

export default function ForgotPassOTP() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const { verifyResetOtp, loading, requestPasswordReset } = useAuthStore();
  // FOR RESEND OTP
  const [cooldown, setCooldown] = useState(0);

  const handleVerify = async () => {
    if (otp.length < 6) {
      toast.error("Enter valid 6-digit code");
      return;
    }

    const result = await verifyResetOtp(email, otp);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("OTP verified! You may now reset your password.");
    navigate("/forgot-change-password");
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    await requestPasswordReset(email);
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
    <div className="bg-background text-foreground flex h-screen items-center justify-center">
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

        <Button
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
          className="w-full"
        >
          {loading ? "Verifying..." : "Verify Code"}
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
          onClick={() => navigate("/")}
          variant="ghost"
          className="flex w-full cursor-pointer items-center justify-center gap-2"
        >
          <MoveLeft /> Back to login
        </Button>
      </div>
    </div>
  );
}
