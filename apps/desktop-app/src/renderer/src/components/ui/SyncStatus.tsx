import React from "react";
import { useSyncStatusStore } from "@renderer/stores/useSyncStatusStore";
import { Loader2, WifiOff, CheckCircle } from "lucide-react";

export const SyncStatus = () => {
  const { online, syncing, lastSynced } = useSyncStatusStore();

  if (!online) {
    return (
      <StatusBadge
        color="bg-red-300/60 dark:bg-red-700/60"
        icon={<WifiOff size={14} />}
        text="Offline Mode"
      />
    );
  }

  if (syncing) {
    return (
      <StatusBadge
        color="bg-yellow-300/60 dark:bg-yellow-700/60 "
        icon={<Loader2 size={14} className="animate-spin" />}
        text={"Syncing...."}
      />
    );
  }

  return (
    <StatusBadge
      color="bg-green-300/60 dark:bg-green-700/60"
      icon={<CheckCircle size={14} />}
      text={lastSynced ? `Synced at ${lastSynced}` : "All Synced ✓"}
    />
  );
};

const StatusBadge = ({
  color,
  icon,
  text,
}: {
  color: string;
  icon: React.ReactNode;
  text: string;
}) => (
  <div
    className={`right-3 bottom-3 flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-medium shadow-md ${color}`}
  >
    {icon}
    <span>{text}</span>
  </div>
);
