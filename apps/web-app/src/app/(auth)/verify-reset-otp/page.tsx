import VerifyResetOtp from "@/components/auth/ResetOTPForm";
import { Suspense } from "react";

export default function VerifyResetOtpPage() {
  return (
    <div className="bg-BGlight dark:bg-BGdark flex min-h-screen items-center justify-center px-5 sm:px-10">
      <Suspense fallback={null}>
        <VerifyResetOtp />
      </Suspense>
    </div>
  );
}
