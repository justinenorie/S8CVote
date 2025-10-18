import { redirect } from "next/navigation";
import { createServerClientInstance } from "@/lib/supabase/server";
import DashboardLayout from "@/components/dashboard/DashboardLayoutClient";

const ProtectedRoutes = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createServerClientInstance();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default ProtectedRoutes;
