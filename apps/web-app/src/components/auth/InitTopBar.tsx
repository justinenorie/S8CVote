import Typography from "@/components/ui/Typography";

export const InitTopBar = () => {
  return (
    <div className="dark:text-TEXTlight text-TEXTdark fixed -z-50 flex min-h-screen w-full flex-col">
      {/* Top Banner */}
      <header className="flex w-full items-center gap-3 border-b px-6 py-4 shadow-sm">
        <img
          src="/s8cvote.png"
          alt="S8CVote Logo"
          className="h-8 w-8 object-contain"
        />
        <Typography variant="h3" className="font-semibold tracking-wide">
          S8CVote
        </Typography>
      </header>
    </div>
  );
};
