"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import { Home, BarChart2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
                <BarChart2 size={16} />
                Results
              </Button>
            </Link>
          </nav>

          {/* Right Section (User Info) */}
          {/* TODO: Fetch User Data for Full Name and StudentID */}
          {/* TODO: Clickable to have dropdown menu of Profile and Logout Button */}
          <div className="text-muted-foreground text-sm">
            <Typography variant="small" className="font-medium">
              Student D User
            </Typography>
            <p className="text-right text-xs">00-0000</p>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="mx-auto max-w-[1200px] px-6 py-8">{children}</main>
    </div>
  );
}
