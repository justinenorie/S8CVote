import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ChartBarStacked,
  BarChart,
  Settings,
  ContactRound,
  ChevronsRight,
  ChevronsLeft,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import Typography from "../ui/Typography";
import { Button } from "../ui/Button";
import s8cvotelogo from "../../assets/S8CVote-TempLogo.png";
import { useAuthStore } from "@renderer/stores/useAuthStore";
import AppRoutes from "@renderer/routes/AppRoutes";
import { toast } from "sonner";
import { ConfirmDialog } from "../ui/ConfirmDialog";

const SideNav = (): React.JSX.Element => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = React.useState(false);

  const location = useLocation();

  const { signOut, error, loading, loadAdminData, adminData } = useAuthStore();

  React.useEffect(() => {
    loadAdminData();
  }, []);

  // TODO: it also clear the tokens
  const logout = async (): Promise<void> => {
    await signOut();

    if (!useAuthStore.getState().user) {
      toast.success("Logout Success!", {
        description: "Clearing out your tokens...",
      });
      <AppRoutes />;
    } else {
      toast.error(error, {
        description: `Please check: ${error}`,
      });
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard /> },
    { label: "Elections", path: "/elections", icon: <ChartBarStacked /> },
    { label: "Candidates", path: "/candidates", icon: <Users /> },
    { label: "Students", path: "/students", icon: <ContactRound /> },
    { label: "Reports", path: "/reports", icon: <BarChart /> },
  ];

  return (
    <aside
      className={`bg-PRIMARY-50 dark:bg-PRIMARY-950 text-TEXTdark dark:text-TEXTlight z-10 h-screen shadow-[7px_7px_21px_5px_rgba(0,_0,_0,_0.1)] transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } flex flex-col`}
    >
      {/* Logo / Toggle */}
      <div className="p-4">
        <div className="flex w-full items-center justify-between py-2">
          {!isCollapsed && (
            <div className="flex flex-row place-items-center content-center gap-2">
              <img src={s8cvotelogo} alt="s8cvotelogo" className="h-10 w-10" />
              <Typography variant="h3">S8CVote</Typography>
            </div>
          )}

          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hover:bg-BGdark/10 dark:hover:bg-BGlight/10 text-TEXTdark dark:text-TEXTlight items-center rounded-md p-2 ${isCollapsed ? "w-full" : ""}`}
          >
            {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
          </Button>
        </div>
        <div className="border-TEXTdark/30 dark:border-TEXTlight/30 w-full border-b" />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "hover:bg-BGdark/10 dark:hover:bg-BGlight/10"
            }`}
          >
            {item.icon}
            {!isCollapsed && <Typography variant="p">{item.label}</Typography>}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="grid gap-2 p-4">
        <div className="border-TEXTdark/30 dark:border-TEXTlight/30 my-2 w-full border-t" />
        <Link
          to="/settings"
          className={`flex items-center gap-3 rounded-md px-3 py-2 ${
            location.pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-BGdark/10 dark:hover:bg-BGlight/10"
          }`}
        >
          <Settings />
          {!isCollapsed && <Typography variant="p">Settings</Typography>}
        </Link>

        <ThemeToggle isCollapsed={isCollapsed} />

        {!isCollapsed ? (
          <div className="flex flex-row place-content-between items-center">
            <img src={s8cvotelogo} alt="s8cvotelogo" className="h-10 w-10" />
            {/* TODO: Change this based on the what user admin logged in */}
            <div className="row-span-2 grid">
              <Typography variant="p">{adminData?.fullname}</Typography>
              <Typography variant="small">{adminData?.email}</Typography>
            </div>
            <Button variant="ghost" onClick={() => setShowConfirmLogout(true)}>
              <LogOut />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setShowConfirmLogout(true)}>
            <LogOut />
          </Button>
        )}

        <ConfirmDialog
          open={showConfirmLogout}
          onClose={() => setShowConfirmLogout(false)}
          onConfirm={() => {
            setShowConfirmLogout(false);
            logout();
          }}
          isLoading={loading}
          title="Confirm Logout"
          description="Are you sure you want to log out?"
          confirmLabel="Logout"
          confirmVariant="destructive"
        />
      </div>
    </aside>
  );
};

export default SideNav;
