"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import { Home, ChartGantt, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="bg-BGlight dark:bg-BGdark min-h-screen">
      {/* Top Navigation Bar */}
      <header className="bg-card border-b shadow-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
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

          {/* Center Navigation */}
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Home size={16} />
                Dashboard
              </Button>
            </Link>
            <Link href="/results">
              <Button
                variant={pathname === "/results" ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <ChartGantt size={16} />
                Results
              </Button>
            </Link>
          </nav>

          {/* Right Section (User Info) */}
          {/* TODO: Fetch User Data for Full Name and StudentID */}
          {/* TODO: Clickable to have dropdown menu of Profile and Logout Button */}
          {/* Right Section (User Info + Dropdown) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer">
                <div className="text-muted-foreground flex flex-col text-right text-sm">
                  <Typography variant="p">Student D User</Typography>
                  <Typography variant="small" className="text-right">
                    00-0000
                  </Typography>
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
                onClick={() => router.push("/profile")}
              >
                <User size={16} />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2 text-red-500 focus:text-red-600"
                onClick={() => console.log("Logout clicked")}
              >
                <LogOut size={16} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Page Content */}
      <main className="mx-auto max-w-[1200px] px-6 py-8">{children}</main>
    </div>
  );
}
