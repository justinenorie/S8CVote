import ResetPasswordPage from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

export default function VerifyOtp() {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-3 sm:px-10">
      <Suspense fallback={null}>
        <ResetPasswordPage />
      </Suspense>
    </div>
  );
}
