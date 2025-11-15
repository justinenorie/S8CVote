import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@renderer/stores/useAuthStore";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@renderer/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@renderer/components/ui/Button";
import Typography from "@renderer/components/ui/Typography";
import { MoveLeft } from "lucide-react";

const VerifyAdminOtpPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
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

    toast.success("Email verified! Waiting for admin approval.");
    navigate("/pending-approval");
  };

  // resend
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
    <div className="bg-BGlight dark:bg-BGdark text-TEXTdark dark:text-TEXTlight grid h-screen place-content-center gap-6">
      <Typography variant="h2" className="text-center">
        Verify Your Email
      </Typography>

      <Typography variant="small" className="text-muted-foreground text-center">
        Enter the 6-digit code sent to <b>{email}</b>
      </Typography>

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

      <Button onClick={handleVerify} disabled={loading || otp.length < 6}>
        {loading ? "Verifying..." : "Verify Code"}
      </Button>

      <div className="flex flex-row items-center justify-center">
        <Typography variant="small">{"Didn't receive a OTP code?"}</Typography>

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
        className="flex cursor-pointer items-center"
      >
        <MoveLeft />
        Back to Login
      </Button>
    </div>
  );
};

export default VerifyAdminOtpPage;
