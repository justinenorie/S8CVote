import DashboardLayout from "@/components/dashboard/DashboardLayoutClient";

const ProtectedRoutes = async ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default ProtectedRoutes;
