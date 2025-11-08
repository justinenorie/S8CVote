import VerifyResetOtp from "@/components/auth/ResetOTPForm";
import { Suspense } from "react";

export default function VerifyResetOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-10">
      <Suspense fallback={null}>
        <VerifyResetOtp />
      </Suspense>
    </div>
  );
}
