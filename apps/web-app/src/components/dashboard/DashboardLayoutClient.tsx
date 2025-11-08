"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import { Home, ChartGantt, User, LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStores";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { signOutStudent, getCurrentUser, error, profile, loading } =
    useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const signOut = async () => {
    await signOutStudent();

    if (!useAuthStore.getState().user) {
      toast.success("Logout Success!", {
        description: "Clearing out your tokens...",
      });
      router.push("/");
    } else {
      toast.error(error, {
        description: `Please check: ${error}`,
      });
    }
  };

  return (
    <div className="bg-BGlight dark:bg-BGdark min-h-screen">
      {/* Top Navigation Bar */}
      <header className="bg-card border-b shadow-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between p-3 sm:p-6">
          {/* Left Section */}
          <div className="flex items-center gap-2">
            <Image
              src="/s8cvote.png"
              alt="S8CVote Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <Typography variant="h4" className="font-semibold">
              S8CVote
            </Typography>
          </div>

          {/* Center Navigation (Desktop Only) */}
          <nav className="hidden items-center gap-3 sm:flex">
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Home size={16} />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/results">
              <Button
                variant={
                  pathname === "/dashboard/results" ? "default" : "outline"
                }
                className="flex items-center gap-2"
              >
                <ChartGantt size={16} />
                Results
              </Button>
            </Link>
          </nav>

          {/* Desktop User Dropdown */}
          <div className="hidden sm:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                  <div className="text-muted-foreground flex flex-col text-right text-sm">
                    {loading ? (
                      <Typography variant="small">Loading.....</Typography>
                    ) : (
                      <div>
                        <Typography variant="p">{profile?.fullname}</Typography>
                        <Typography variant="small" className="text-right">
                          {profile?.student_id}
                        </Typography>
                      </div>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                  <ThemeToggle />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => router.push("/dashboard/profile")}
                >
                  <User size={16} />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-500 focus:text-red-600"
                  // TODO: Add a confirmation dialog here instead of directly signing out....
                  onClick={() => signOut()}
                >
                  <LogOut size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Sidebar */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="bg-PRIMARY-50 dark:bg-PRIMARY-900 flex w-64 flex-col justify-between p-5"
              >
                {/* Top Section */}
                <div>
                  <SheetHeader className="mb-4 flex flex-row items-center gap-2">
                    <Image
                      src="/s8cvote.png"
                      alt="S8CVote Logo"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <SheetTitle>S8CVote</SheetTitle>
                  </SheetHeader>

                  {/* Nav Links */}
                  <div className="flex flex-col gap-2">
                    <SheetDescription>Navigations</SheetDescription>
                    <Link href="/dashboard">
                      <SheetClose asChild>
                        <Button
                          variant={
                            pathname === "/dashboard" ? "default" : "link"
                          }
                          className="w-full justify-start"
                        >
                          <Home size={16} className="mr-2" />
                          Dashboard
                        </Button>
                      </SheetClose>
                    </Link>

                    <Link href="/dashboard/results">
                      <SheetClose asChild>
                        <Button
                          variant={
                            pathname === "/dashboard/results"
                              ? "default"
                              : "link"
                          }
                          className="w-full justify-start"
                        >
                          <ChartGantt size={16} className="mr-2" />
                          Results
                        </Button>
                      </SheetClose>
                    </Link>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-6 flex flex-col gap-3 border-t pt-4">
                  <SheetClose asChild>
                    <Button
                      variant="link"
                      className="w-full justify-start text-left"
                      onClick={() => router.push("/dashboard/profile")}
                    >
                      <div className="flex flex-col items-start">
                        {loading ? (
                          <Typography variant="small">Loading.....</Typography>
                        ) : (
                          <div>
                            <Typography variant="p">
                              {profile?.fullname}
                            </Typography>
                            <Typography variant="small" className="text-right">
                              {profile?.student_id}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </Button>
                  </SheetClose>

                  <div className="px-4">
                    <ThemeToggle />
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => signOut()}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="mx-auto max-w-[1200px] p-3 sm:p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
