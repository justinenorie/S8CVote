import Typography from "@/components/ui/Typography";
import Image from "next/image";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark:text-TEXTlight text-TEXTdark flex w-full flex-col">
      {/* Top Banner */}
      <header className="flex w-full items-center gap-3 border-b px-6 py-4 shadow-sm">
        <Image
          src="/s8cvote.png"
          alt="S8CVote Logo"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <Typography className="text-xl font-semibold tracking-wide">
          S8CVote
        </Typography>
      </header>

      {/* Auth Content */}
      <main className="absolute w-full">{children}</main>
    </div>
  );
}
