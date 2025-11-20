import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, MonitorSmartphone } from "lucide-react";

export default function ApplicationDownload() {
  return (
    <div className="bg-background flex h-screen items-center">
      <div className="bg-card mx-auto max-w-lg space-y-8 rounded-2xl p-8 shadow-md">
        {/* Header */}
        <div className="space-y-1 text-center">
          <Typography variant="h1">Download S8CVote Admin Apps</Typography>
          <Typography variant="p" className="text-muted-foreground">
            Install the latest versions of the Desktop and Mobile applications.
          </Typography>
        </div>

        {/* Desktop App Section */}
        <div className="space-y-3 rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <MonitorSmartphone size={26} className="text-primary" />
            <Typography variant="h3">Desktop Application</Typography>
          </div>

          <Typography variant="small" className="text-muted-foreground">
            Recommended for Admin, Election Management, Live Dashboard and
            Tallying.
          </Typography>

          <a
            href="https://github.com/justinenorie/S8CVote/releases/download/v1.0.0-desktop/S8CVote_ADMIN_DESKTOP.exe"
            download
            className="bg-primary text-TEXTlight dark:text-TEXTdark hover:bg-primary/90 mt-4 flex w-full items-center justify-center gap-2 rounded-lg p-3 font-medium transition"
          >
            <Download size={18} />
            <Typography variant="small">Download Desktop (.exe)</Typography>
          </a>
        </div>

        {/* Mobile App Section */}
        <div className="space-y-3 rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <Smartphone size={26} className="text-primary" />
            <Typography variant="h3">Mobile Application</Typography>
          </div>

          <Typography variant="small" className="text-muted-foreground">
            For on-site voting, room-to-room operations, and offline-first
            voting.
          </Typography>

          <a
            href="https://github.com/justinenorie/S8CVote/releases/download/v1.0.0-mobile/S8CVote.apk"
            download
            className="bg-primary hover:bg-primary/90 text-TEXTlight dark:text-TEXTdark mt-4 flex w-full items-center justify-center gap-2 rounded-lg p-3 font-medium transition"
          >
            <Download size={18} />
            <Typography variant="small">Download Mobile (.apk)</Typography>
          </a>
        </div>
      </div>
    </div>
  );
}
