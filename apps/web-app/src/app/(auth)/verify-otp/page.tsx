import VerifyOtpForm from "@/components/auth/OTPForm";
import { Suspense } from "react";

export default function VerifyOtp() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 sm:px-10">
      <Suspense fallback={null}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
